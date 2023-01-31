<template>
  <k-layout>
    <template #header> 漂流瓶 </template>
    <k-content>
      <k-card>
        <div class="table-header">
          <el-button @click="loadData">刷新</el-button>
          <el-input
            style="max-width: 30rem"
            v-model="searchKey"
            placeholder="QQ号/QQ群/消息内容"
            clearable
            :prefix-icon="Search"
          />
        </div>
        <el-table :data="tableData" max-height="80vh">
          <el-table-column prop="id" label="id" width="50" />
          <el-table-column prop="userId" label="QQ号" width="120" />
          <el-table-column prop="guildId" label="QQ群" width="120" />
          <el-table-column prop="content" label="消息内容" min-width="250">
            <template #default="scope">
              <p v-html="fixImg(scope.row.content)" />
            </template>
          </el-table-column>
          <el-table-column label="公共池" width="80">
            <template #default="scope">
              <span>{{ scope.row.isPublic === 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建于" width="160">
            <template #default="scope">
              {{ toLocalString(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column
            label="屏蔽"
            width="120"
            :filters="[
              { text: '是', value: 'true' },
              { text: '否', value: 'false' },
            ]"
            :filter-method="filterBannedAt"
          >
            <template #default="scope">
              <el-switch
                @click="switchBan(scope.row.id, scope.row.isBanned === true)"
                v-model="scope.row.isBanned"
                :title="
                  Date.parse(scope.row.bannedAt) > 0
                    ? toLocalString(scope.row.bannedAt)
                    : null
                "
                style="--el-switch-on-color: #ff4949"
              />
            </template>
          </el-table-column>
        </el-table>

        <template #footer>
          <div style="display: flex; justify-content: space-between;">
            <el-pagination
              layout="prev, pager, next"
              :page-count="totalPages"
              :current-page="page"
              @update:current-page="handlePageChanged"
            />
            <span>总计：{{ totalLines }}条</span>
          </div>
        </template>
      </k-card>
    </k-content>
  </k-layout>
</template>

<style>
.k-content {
  max-width: 90%;
}

.table-header {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}
</style>

<script lang="ts" setup>
import { send } from '@koishijs/client'
import { DriftBottle } from '@ifrank/koishi-plugin-drift-bottle/src'
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { throttle } from 'lodash'

const page = ref(1)
const totalLines = ref(0)
const totalPages = ref(0)

type TableRow = DriftBottle & { isBanned?: boolean };

const tableData = ref<TableRow[]>()

const searchKey = ref('')

onMounted(() => {
  loadData()
})

const loadData = () => {
  send('get-data', page.value).then((res) => {
    totalLines.value = res.totalLines
    totalPages.value = res.totalPages
    tableData.value = res.data
    tableData.value.forEach((element, index) => {
      tableData.value![index] = Object.assign(element, {
        isBanned: Date.parse(element.bannedAt as unknown as string) > 0,
      })
    })
  })
}

const handlePageChanged = (currentPage: number) => {
  page.value = currentPage
  if (searchKey.value === '') {
    loadData()
  } else {
    search()
  }
}

watch(searchKey, () => {
  search()
})

const search = throttle(
  () => {
    send('search', searchKey.value, page.value).then((res) => {
      totalLines.value = res.totalLines
      totalPages.value = res.totalPages
      tableData.value = res.data
      tableData.value.forEach((element, index) => {
        tableData.value![index] = Object.assign(element, {
          isBanned: Date.parse(element.bannedAt as unknown as string) > 0,
        })
      })
    })
  },
  500,
  {
    leading: false,
    trailing: true,
  }
)

const fixImg = (html: string): string => {
  const regex = /<image .* url="(https:\/\/gchat\.qpic\.cn\/[^"]*)".*\/>/i
  while (regex.test(html)) {
    html = html.replace(
      'url="https://gchat.qpic.cn',
      'referrerPolicy="no-referrer" width="80px" src="https://gchat.qpic.cn'
    )
  }
  return html
}

const toLocalString = (s: string) => {
  const date = new Date(Date.parse(s))
  return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

const switchBan = (id: number, ban: boolean) => {
  send('switch-ban', id, ban)
    .then(() => {
      ElMessage({
        message: '操作成功！',
        type: 'success',
      })
      loadData()
    })
    .catch((error) => {
      ElMessage.error('操作失败：' + error)
    })
}

const filterBannedAt = (value: string, row: TableRow) => {
  return row.isBanned!.toString() === value
}
</script>
