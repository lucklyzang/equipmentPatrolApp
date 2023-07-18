<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="历史巡检任务详情" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <van-tabs v-model="activeName" color="#1684FC" title-inactive-color="#BEC7D1" title-active-color="#1684FC" @change="vanTabsChangeEvent">
                <van-tab title="18:00" name="18:00">
                    <van-empty description="暂无数据" v-if="isShowNoMoreData" />
                    <div class="backlog-task-list-box">
                        <div class="backlog-task-list">
                            <div class="backlog-task-top">
                                <div class="backlog-task-top-left">
                                    <span>任务编号</span>
                                </div>
                            </div>
                            <div class="backlog-task-content">
                               <div class="equipment-name-list" @click="equipmentChecklistEvent">
                                   <div class="equipment-name">
                                       中央空调 1#
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 2#
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 3#
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </van-tab>
                <van-tab title="14:00" name="14:00">
                    <van-empty description="暂无数据" v-if="isShowNoMoreData" />
                    <div class="backlog-task-list-box">
                        <div class="backlog-task-list">
                            <div class="backlog-task-top">
                                <div class="backlog-task-top-left">
                                    <span>任务编号</span>
                                </div>
                            </div>
                            <div class="backlog-task-content">
                               <div class="equipment-name-list" @click="equipmentChecklistEvent">
                                   <div class="equipment-name">
                                       中央空调 1#
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 2#
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 3#
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </van-tab>
            </van-tabs>
            <div class="complete-btn-box">
                <div class="complete-btn" @click="backEvent">返回</div>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {getAllTaskList} from '@/api/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
export default {
  name: "HistoryEquipmentPatrolDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      isShowNoMoreData: false,
      activeName: '14:00',
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/historyEquipmPatroLTaskList')
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","taskType"])
  },

  methods: {
    ...mapMutations(["changePatrolTaskListMessage","changeTaskType"]),

    onClickLeft () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 返回事件
    backEvent () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 获取任务列表
    queryTaskList (taskType,page,pageSize) {
        this.loadingShow = true;
        this.overlayShow = true;
		getAllTaskList({proId : this.userInfo.proIds[0], workerId: this.userInfo.id,taskType,system:6,page,pageSize})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
            } else {
                this.$toast({
                    type: 'fail',
                    message: res.data.msg
                })
            }
      })
      .catch((err) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    },

    // tab切换值变化事件
    vanTabsChangeEvent (value) {
    },

    // 点击进入设备检查单事件
    equipmentChecklistEvent () {
        // this.changePatrolTaskListMessage(item);
        // let temporaryMessage = this.taskType;
        // temporaryMessage['taskTypeName'] = this.activeName;
        // this.changeTaskType(temporaryMessage);
        this.$router.push('/historyEquipmentChecklist')
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
        .van-nav-bar__right {
          .van-nav-bar__text {
            color: #fff
          }
        };
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        background: #F7F7F7;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 50px;
        /deep/ .van-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 0;
            .van-tabs__wrap {
                border-right: 1px solid #333;
                border-left: 1px solid #333;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                .bottom-border-1px(#BEC7D1);
                .van-tabs__nav {
                    .van-tab {
                        flex: none !important;
                        width: 90px
                    };
                }
            };
            .van-tabs__content {
                flex: 1;
                padding: 12px 4px 0px 4px;
                box-sizing: border-box;
                background: #f7f7f7;
                overflow: scroll;
                .van-tab__pane {
                    height: 100%;
                    position: relative;
                    .van-empty {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%)
                    };
                    .backlog-task-list-box {
                        overflow: scroll;
                        height: 100%;
                        .backlog-task-list {
                            padding: 0 0 4px 0;
                            box-sizing: border-box;
                            border-radius: 6px;
                            background: #fff;
                            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                            margin-bottom: 10px;
                            .backlog-task-top {
                                height: 40px;
                                padding: 0 14px;
                                box-sizing: border-box;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                font-size: 16px;
                                color: #101010;
                                .bottom-border-1px(#BEC7D1);
                                .backlog-task-top-left {
                                    flex: 1;
                                    .no-wrap()
                                }
                            };
                            .backlog-task-content {
                                position: relative;
                                padding: 10px 14px 8px 14px;
                                box-sizing: border-box;
                                .equipment-name-list {
                                    display: flex;
                                    align-items: center;
                                    height: 30px;
                                    margin-bottom: 10px;
                                    .equipment-name {
                                        height: 30px;
                                        line-height: 30px;
                                        padding: 0 8px;
                                        box-sizing: border-box;
                                        background: #C5E5E0;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        color: #101010;
                                        flex: 1;
                                        margin-right: 6px
                                    };
                                    &:last-child {
                                        margin-bottom: 0
                                    }
                                }
                            }
                        };
                        .no-more-data {
                            font-size: 12px;
                            color: #BEC7D1;
                            width: 100%;
                            text-align: center;
                            line-height: 30px
                        }
                    }
                }        
            }
        };
        .complete-btn-box {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            .complete-btn {
                width: 60%;
                height: 45px;
                text-align: center;
                line-height: 45px;
                font-size: 14px;
                color: #fff;
                background: linear-gradient(to right, #6cd2f8, #2390fe);
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                border-radius: 20px
            }
        }
    }
  }
}
</style>