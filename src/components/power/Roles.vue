<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 ===0 ? 'bdtop': '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <p class="el-icon-caret-right"></p>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 !== 0? 'bdtop':'','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <p class="el-icon-caret-right"></p>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children "
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}{{i3}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close='setRightDialogClosed' >
      <el-tree ref="treeRef" :data="rightsList" :default-checked-keys='defKeys' :props="treeProps" node-key="id" show-checkbox default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloteRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from 'q'
export default {
  created() {
    this.getRoleList()
  },
  data() {
      return{
        roleId: '',
        treeProps:{
          label : 'authName',
          children: 'children'

        },
        defKeys:[],
    roleList: [],
    // 控制分配权限对话框的显示与隐藏
    setRightDialogVisible:0,
    rightsList:[] //所有权限的数据
      }
  },
  methods: {
   async alloteRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(keys)
      console.log(idStr)
   const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
       return this.$message.error('更新权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible= false
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    getSanJiJieDian(node, list){
      if( !node.children) return list.push(node.id)
      node.children.forEach(element => {
        this.getSanJiJieDian(element,list)
      });
    },
    async showRightDialog(role){
      this.roleId= role.id
      // 展示分配权限的对话框
      this.setRightDialogVisible = true
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$http.error('获取权限失败')
    this.rightsList = res.data
    this.getSanJiJieDian(role,this.defKeys)
    this.setRightDialogVisible = true
    console.log(this.rightsList)
    },
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      console.log(this.roleList)
    },
    async removeRightById(role,rightId){
      const isconfirm =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(isconfirm !=='confirm') return this.$message.info('取消了删除')
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !==200) return this.$http.$message.error('删除权限失败')

        // this.getRoleList()
        role.children = res.data

    }
  }
}
</script>

<style lang = 'less' scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>