<template>
  <span style="margin-right:10px">
    <input class="input-file" type="file" @change="exportData"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <el-button type="primary" size="mini" icon="el-icon-upload" @click="btnClick">上传Excel表格数据</el-button>
  </span>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: "XlsxUpload",
  data() {
    return {}
  },
  methods: {
    btnClick() {
      document.querySelector('.input-file').click()
    },
    exportData(event) {
      if (!event.currentTarget.files.length) {
        return
      }
      const that = this
      // 拿取文件对象
      let f = event.currentTarget.files[0]
      // 用FileReader来读取
      let reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = ''
        let wb // 读取完成的数据
        let outdata // 你需要的数据
        let reader = new FileReader()
        reader.onload = function (e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          let bytes = new Uint8Array(reader.result)
          let length = bytes.byteLength
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          // 自定义方法向父组件传递数据
          that.$emit('getResult', outdata)
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    }
  }
}

</script>

<style scoped>
.input-file {
  display: none;
}
</style>



使用组件
