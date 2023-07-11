<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="设备巡检详情" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight" right-text="历史任务" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <div class="task-set-box">
                <div class="task-set-name" :class="{'taskSetNameStyle': taskSetNameIndex == index }" v-for="(item,index) in taskSetList" :key="item" @click="taskSetNameClickEvent(item,index)">
                    {{ item }}
                </div>
            </div>
            <van-tabs v-model="activeName" color="#1684FC" title-inactive-color="#101010" title-active-color="#0A7AF5" @change="vanTabsChangeEvent">
                <van-tab title="18:00" name="18:00">
                    <van-empty description="暂无数据" v-if="isShowNoMoreData" />
                    <div class="backlog-task-list-box">
                        <div class="backlog-task-list">
                            <div class="backlog-task-top">
                                <div class="backlog-task-top-left">
                                    <span>任务编号</span>
                                </div>
                                <div class="backlog-task-top-right" @click="clockInEvent">
                                    <span>已打卡</span>
                                </div>
                            </div>
                            <div class="backlog-task-content">
                               <div class="equipment-name-list" @click="equipmentChecklistEvent">
                                   <div class="equipment-name">
                                       中央空调 1#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingFailPng" alt="">
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 2#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingPng" alt="">
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 3#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingSuccessPng" alt="">
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
                                <div class="backlog-task-top-right" @click="clockInEvent">
                                    <span>已打卡</span>
                                </div>
                            </div>
                            <div class="backlog-task-content">
                               <div class="equipment-name-list" @click="equipmentChecklistEvent">
                                   <div class="equipment-name">
                                       中央空调 1#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingFailPng" alt="">
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 2#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingGif" alt="">
                                   </div>
                               </div>
                               <div class="equipment-name-list">
                                   <div class="equipment-name">
                                       中央空调 3#
                                   </div>
                                   <div class="operation-icon-box">
                                       <img :src="uploadingSuccessPng" alt="">
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </van-tab>
            </van-tabs>
            <div class="complete-btn-box">
                <div class="complete-btn" @click="completeTaskEvent">完成任务</div>
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
  name: "EquipmentPatrolDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      taskSetNameIndex: 0,
      taskSetList: ['任务集A','任务集B','任务集C','任务集D','任务集E','任务集F'],
      totalCount: '',
      backlogTaskTimer: 0,
      isShowNoMoreData: false,
      completetedTaskTimer: 0,
      timeOne: null,
      timeTwo: null,
      activeName: '14:00',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      uploadingSuccessPng: require("@/common/images/home/uploading-success.png"),
      uploadingGif: require("@/common/images/home/uploading.gif"),
      uploadingFailPng: require("@/common/images/home/uploading-fail.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/home')
  },

  beforeDestroy () {
    if (this.timeOne) {
        clearTimeout(this.timeOne)
    };
    if (this.timeTwo) {
        clearTimeout(this.timeTwo)
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/home') {
       
      } else {
       
      }
	});
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","taskType"])
  },

  methods: {
    ...mapMutations(["changePatrolTaskListMessage","changeTaskType"]),

    onClickLeft () {
        this.$router.push({path: '/home'})
    },

    onClickRight () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 任务集名称点击事件
    taskSetNameClickEvent (item,index) {
        this.taskSetNameIndex = index
    },

    // 打卡事件
    clockInEvent () {

    },

    // 完成任务事件
    completeTaskEvent () {},

    // 任务状态转换
    taskStatusTransition (num) {
        switch(num) {
            case 1 :
                return '未开始'
                break;
            case 2 :
                return '进行中'
                break;
            case 3 :
                return '待签字'
                break;
            case 4 :
                return '已完成'
                break;
        }
    },

    // 任务集类型转换
    taskSetTransition (num) {
        switch(num) {
            case '1' :
                return '每天'
                break;
            case '2' :
                return '每周'
                break;
            case '3' :
                return '工作日'
                break;
            case '4' :
                return '节假日和周末'
                break;
        }
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

    // 拼接完整时间
    getFullDate(hourTime) {
      let currentdate;
      let strDate;
      let seperator1 = "-";
      let month = new Date().getMonth() + 1;
      strDate = new Date().getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = new Date().getFullYear() + seperator1 + month + seperator1 + strDate
      return currentdate + ' ' + hourTime
    },

    // 获取当前离任务开始时间最近的时间点
    disposeTime (item) {
      if (Object.prototype.toString.call(item.startTime) === '[object Array]') {
        if (item.startTime.length > 0) {
          let temporaryArr = [];
          // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
          if (new Date().getTime() >= new Date(this.getFullDate(item.startTime[item.startTime.length-1])).getTime()) {
            temporaryArr.push(item.startTime[item.startTime.length-1])
          } else {        
            for (let i=0, len = item.startTime.length; i<len; i++) {
              if (i > 0) {
                if (new Date().getTime() < new Date(this.getFullDate(item.startTime[i])).getTime()) {
                  temporaryArr.push(item.startTime[i-1])
                  break
                }
              }    
            }
          };    
          return temporaryArr.join(',')
        }
      }
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
        this.$router.push('/equipmentChecklist')
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
        .task-set-box {
            background: #fff;
            padding: 10px 14px 0 14px;
            box-sizing: border-box;
            align-items: flex-start;
            flex-wrap: nowrap;
            display: flex;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            &::-webkit-scrollbar {
                height: 0;
                display: none
            };
            .task-set-name {
                font-size: 14px;
                color: #9C9FA3;
                flex: none;
                padding: 6px 12px;
                border: 1px solid #9C9FA3;
                box-sizing: border-box;
                margin-right: 10px;
                border-radius: 4px;
                &:last-child {
                    margin-right: 0
                } 
            };
            .taskSetNameStyle {
                color: #0379FF;
                border: 1px solid #0379FF
            }
        };
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
                                .bottom-border-1px(#a9a9a9);
                                .backlog-task-top-left {
                                    flex: 1;
                                    .no-wrap()
                                };
                                .backlog-task-top-right {
                                    width: 70px;
                                    font-size: 14px;
                                    text-align: right;
                                    span {
                                        display: inline-block;
                                        width: 62px;
                                        height: 22px;
                                        text-align: right;
                                        line-height: 22px;
                                        color: #289E8E;
                                        border-radius: 6px
                                    };
                                    .spanNoStartStyle {
                                        background: #0A7AF5;
                                        color: #fff
                                    }
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
                                        background: #DCDCDC;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        color: #101010;
                                        flex: 1;
                                        margin-right: 6px;
                                        .equipmentNoCompleteStyle {
                                           background: #F8CFAD
                                        };
                                        .equipmentCompletedStyle {
                                           background: #C5E5E0
                                        }
                                    };
                                    .operation-icon-box {
                                        width: 70px;
                                        text-align: left;
                                        img {
                                            width: 20px
                                        }
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
                font-size: 12px;
                color: #333;
                background: #DCDCDC;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                border-radius: 20px
            };
            .completeBtnStyle {
                background: linear-gradient(to right, #6cd2f8, #2390fe) !important;
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1) !important
            }
        }
    }
  }
}
</style>