<script>
import * as XLSX from "xlsx"

import { computed, ref } from 'vue'

const search = ref('')
// const filterTableData = computed(() =>
//   tableData.filter(
//     (data) =>
//       !search.value ||
//       data.name.toLowerCase().includes(search.value.toLowerCase())
//   )
// )

export default {
  data() {
    return {
      fileList: [],
      tableHead: [],
      tableData: [],
      params: { name: '', page: 1, size: 2 },
      count: 0
    };
  },
  methods: {
    filterTableData: computed(() => this.tableData.filter(
      (data) => !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    )
    ),
    getMyExcelData(e) {
      let fileObj = e.target.files[0];
      // console.log(fileObj)
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileObj);
      fileReader.onload = (e) => {
        const fileData = e.target.result;
        const workbook = XLSX.read(fileData, { type: "binary" });
        // console.log(workbook)
        const workbookSheetName = workbook.SheetNames[0];
        const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbookSheetName]);
        console.log(this);
        this.tableData = sheetJson
        this.tableData = this.filterTableData
        this.count = sheetJson.length
      }

    }
  }
}


</script>

<template>

  <div style="display: grid;">
    <input type="file" @change="getMyExcelData" />
    <el-input v-model="search" size="small" placeholder="Type ID to search" />
    <el-table id="dynamic-table" :data="tableData" :border=true style="width: 100%">

      <el-table-column prop="ID" label="ID" width="180" />
      <el-table-column prop="baseMean" label="baseMean" width="180" />
      <el-table-column prop="log2FoldChange" label="log2FoldChange" />
      <el-table-column prop="lfcSE" label="lfcSE" width="180" />
      <el-table-column prop="stat" label="stat" width="180" />
      <el-table-column prop="pvalue" label="pvalue" />
      <el-table-column prop="padj" label="padj" width="180" />
    </el-table>
    <!-- Pagination -->
    <div class="demo-pagination-block">
      <!-- <div class="demonstration">All combined</div> -->
      <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[10, 20, 50]"
        :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>

  <!-- <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
<template #heading>Documentation</template>

Vue’s
<a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a>
provides you with all information you need to get started.
</WelcomeItem> -->








</template>
