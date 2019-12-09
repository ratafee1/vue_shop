<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->

      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen;"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="min" v-if="scope.row.cat_level == 0 ">一级</el-tag>
          <el-tag type="success" size="min" v-else-if="scope.row.cat_level == 1 ">二级</el-tag>
          <el-tag type="warning" size="min" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
            <!-- options用来指定数据源 -->
          <el-cascader  expand-trigger="hover" :props='cascaderProps'
            v-model="selectedKeys"
            :options="parentCateList"
            clearable
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatedialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
        // 选中的父级分类的id数组
        selectedKeys:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            children:'children'
        },
      // 父级分类的列表
      parentCateList: [],
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 添加分类的数据表单对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        cat_level: 0
      },
      // 控制分类对话框的显示与隐藏
      addCatedialogVisible: false,
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,

      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 是否为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 是否为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 是否为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'opt'
        }
      ]
    }
  },
  methods: {
    //   选择项发生变化触发这个函数
      parentCateChange(){
          console.log(this.selectedKeys)
      },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    handleCurrentChange(newPage) {
      queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      queryInfo.pageSize = newSize
      this.getCateList()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      // console.log(res.data)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 点击按钮，展示分类的对话框
    showAddDialog() {
      // 获取父级数据的分类列表
      this.getParentCateList()
      // 再展示出对话框

      this.addCatedialogVisible = true
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang = 'less' scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
    width: 100%
}
</style>