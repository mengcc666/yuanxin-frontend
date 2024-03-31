<script>
import * as XLSX from "xlsx"

import { computed, reactive, ref } from 'vue'

const search = ref('')

export default {
  data() {
    return {
      fileList: [],
      tableHead: [],
      originTableData: [],
      legalTableData: [],
      params: { name: '', page: 1, size: 10 },
      numberOfDataItemsPerPage: [10, 20, 50, 100],
      count: 0,
      searchInputData: "",
      displayTableData: [],
      currentSortInfo: null,
      meetSearchData: [],
      // filter
      searchFilterForm: []
    };
  },
  methods: {
    search() {
      this.legalTableData = computed(() => this.originTableData.filter(
        (data) => this.searchInputData.length == 0 ||
          data.ID.includes(this.searchInputData)
      ));
      this.count = this.legalTableData.length
      this.params.page = 1
      this.updateTableDisplay()
    },
    getMyExcelData(e) {
      let fileObj = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileObj);
      fileReader.onload = (e) => {
        const fileData = e.target.result;
        const workbook = XLSX.read(fileData, { type: "binary" });
        const workbookSheetName = workbook.SheetNames[0];
        const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[workbookSheetName]);
        this.originTableData = sheetJson
        this.legalTableData = this.originTableData

        this.updateTableDisplay()
      }

    },
    updateTableDisplay() {
      var startIndex = (this.params.page - 1) * this.params.size
      var endIndex = startIndex + this.params.size
      this.displayTableData = this.legalTableData.slice(startIndex, endIndex)
      this.count = this.legalTableData.length
    },
    // invoked when page size changes
    handleSizeChange(val) {
      this.params.size = val;
      this.updateTableDisplay();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.updateTableDisplay();
    },
    sortChange(sortInput) {
      this.currentSortInfo = sortInput;
      if (sortInput.order == "ascending") {
        var columnName = sortInput.prop
        this.legalTableData.sort(this.compareAsc(columnName))
        console.log("ascending test:", this.legalTableData)

      } else if (sortInput.order == "descending") {
        var columnName = sortInput.prop
        this.legalTableData.sort(this.compareDesc(columnName))
        console.log("descending test:", this.legalTableData)

      } else {
        this.legalTableData.sort(this.compareAsc("ID"))

      }

      this.updateTableDisplay()

    },
    compareDesc(propertyName) {
      return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
          return -1;
        } else if (value2 > value1) {
          return 1;
        } else {
          return 0;
        }
      }
    },
    compareAsc(propertyName) {
      return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
          return 1;
        } else if (value2 > value1) {
          return -1;
        } else {
          return 0;
        }
      }
    },
    onSubmitFilter() {
      this.legalTableData = this.originTableData
      var tempLegalTableData = this.legalTableData.filter((item) => {
        return item[this.searchFilterForm.columnName] > this.searchFilterForm.compareValue
      })
      this.legalTableData = tempLegalTableData
      this.updateTableDisplay()
    }
  }
}


</script>

<template>

  <div style="display: grid;">
    <h2>Upload xlsx file</h2>
    <input type="file" @change="getMyExcelData" />
    <h2>Search</h2>

    <el-input v-model="searchInputData" @input="search()" size="small" placeholder="Type ID to search" />

    <h2>Filter</h2>

    <div class="search-filter-box">
      <el-form :model="searchFilterForm" class="demo-form-inline">

        <el-form-item label="Column select">
          <el-select width="100px" v-model="searchFilterForm.columnName" placeholder="baseMean" clearable>
            <el-option label="baseMean" value="baseMean" />
            <el-option label="log2FoldChange" value="log2FoldChange" />
            <el-option label="lfcSE" value="lfcSE" />
            <el-option label="stat" value="stat" />
            <el-option label="pvalue" value="pvalue" />
            <el-option label="padj" value="padj" />
          </el-select>
        </el-form-item>

        <el-form-item label=">">
          <el-input v-model="searchFilterForm.compareValue" placeholder="0.55" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmitFilter">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>

    <h2>Table</h2>

    <el-table id="dynamic-table" :data="displayTableData" :border=true style="width: 100%"
      :default-sort="{ prop: 'ID', order: 'ascending' }" @sort-change="sortChange">

      <el-table-column sortable prop="ID" label="ID" width="110" />
      <el-table-column sortable prop="baseMean" label="baseMean" width="180" />
      <el-table-column sortable prop="log2FoldChange" label="log2FoldChange" />
      <el-table-column sortable prop="lfcSE" label="lfcSE" width="180" />
      <el-table-column sortable prop="stat" label="stat" width="180" />
      <el-table-column sortable prop="pvalue" label="pvalue" />
      <el-table-column sortable prop="padj" label="padj" width="180" />
    </el-table>
    <!-- Pagination -->
    <div class="demo-pagination-block">
      <!-- <div class="demonstration">All combined</div> -->
      <el-pagination v-model:current-page="params.page" v-model:page-size="params.size"
        :page-sizes="numberOfDataItemsPerPage" :small="small" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
