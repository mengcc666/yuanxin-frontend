<template>
    <div v-if="'超级管理员' === $store.getters.getUser.role">
        <xlsx-upload @getResult="getMyExcelData"></xlsx-upload>
        <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column label="序号" type="index" width="80" align="center">
            </el-table-column>
            <el-table-column prop="username" label="卡号" width="180">
            </el-table-column>
            <el-table-column prop="rawPassword" label="卡密" width="180">
            </el-table-column>
            <el-table-column prop="productType" label="型号" width="180">
            </el-table-column>
        </el-table>
        <el-button type="danger" @click="insertYourCardsToDatabase">提交到数据库</el-button>
    </div>
</template>

<script>
import XlsxUpload from "@/views/accounting/XlsxUpload";

const { insertCustomCards } = require("@/api/login");

export default {
    name: "UploadExcel",
    components: { XlsxUpload },
    data() {
        return {
            tableData: [{
                username: '',
                rawPassword: '',
                productType: ''
            }]
        }
    },
    methods: {
        getMyExcelData(data) {
            // data 为读取的excel数据，在这里进行处理该数据
            console.log(data)
            this.tableData = data
        },
        insertYourCardsToDatabase() {
            let JsonUsers = this.tableData;
            //console.log(JsonUsers);
            //console.log(JsonUsers[0].username)
            if (JsonUsers[0].username === '') {
                this.$message('请选择需要上传的文件');
                return
            }
            insertCustomCards(JsonUsers).then((response) => {
                console.log(response)
                this.$alert('成功添加了' + response.data + '条数据\n' + '请在卡片管理页面查看', '成功', {
                    confirmButtonText: '好',
                    type: 'success',
                    callback: () => {
                        this.$router.push('/accounting/CardManage')
                    }
                })
            }).catch(() => {
                this.$alert('数据错误，请检查卡号是否有重复', '出错了', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: () => {
                        this.$router.push('/accounting/CardManage')
                    }
                })
            })
        },

        tableRowClassName({ row, rowIndex }) {
            if (row.productType === 688) {
                return 'warning-row';
            } else if (row.productType === 1088) {
                return 'success-row';
            }
            return '';
        }
    },

}


</script>

<style scoped>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>