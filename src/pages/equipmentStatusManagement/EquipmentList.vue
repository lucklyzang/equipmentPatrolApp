<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <van-nav-bar title="设备列表" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />a
        </div>
        <div class="content-box">
            <div class="content-top">
                <div class="status-box">
                    <span>状态</span>
                    <SelectSearch :itemData="statusOption" ref="statusOption" :isNeedSearch="false" :curData="statusValue" @change="statusOptionChange" />
                </div>
                <div class="name-box">
                    <span>名称</span>
                    <van-field v-model="nameValue" />
                    <van-icon name="search" size="26" color="#0E2442" @click="searchEvent" />
                </div>
            </div>
            <div class="list-title">
                <span>设备名称</span>
                <span>规格型号</span>
                <span>当前状态</span>
            </div>
            <div class="backlog-task-list-box" ref="equipmentStatusList">
              <div class="backlog-task-list" :class="{'listNameStyle':currentListNameIndex == index}" v-for="(item,index) in equipmentStatusList" :key="index" @click="listNameClickEvent(item,index)">
                <span>{{ item.name }}</span>
                <span>{{ item.model }}</span>
                <span>{{ item.status }}</span>
              </div>
              <van-empty description="暂无数据" v-show="equipmentStatusListEmptyShow" />
              <div class="no-more-data" v-show="isShowEquipmentStatusNoMoreData">没有更多数据了!</div>
          </div> 
        </div>
    </div>
    <!-- 设置状态弹框 -->
    <div class="screen-box">
      <van-dialog v-model="screenDialogShow" width="100%" show-cancel-button 
        confirm-button-color="#2390fe"
        :before-close="beforeCloseDialogEvent"
        @confirm="screenDialogSure"
        @cancel="screenDialogCancel"
        confirm-button-text="确认"
        cancel-button-text="关闭"
      >
        <div class="dialog-top">
          <div class="select-title"></div>
          <van-icon name="cross" size="24" @click="closeScreenDialogEvent" />
        </div>
        <div class="dialog-center">
          <div class="dialog-center-one-line">
            <SelectSearch :itemData="statusDialogOption" ref="statusDialogOption" :isNeedSearch="false" :curData="statusDialogValue" @change="statusDialogOptionChange" />
            <div class="date-box">
                <div class="date-content">
                    <span>{{ getNowFormatDate(currentDate) }}</span>
                    <img :src="calendarPng" alt="" @click="dateShow = true" />
                </div>
            </div>
            <van-icon name="add" size="24" color="#0A7AF5" @click="addEquipmentStatusEvent" />
          </div>
          <div class="timer-shaft-list-box">
            <div class="timer-shaft-list" v-for="(item,index) in timerShaftList" :key="index">
                <p>{{ item.status }}</p>
                <p>
                    <span>{{ item.date }}</span>
                    <span>{{ item.name }}</span>
                </p>
            </div>
          </div>
        </div>
      </van-dialog>
    </div>
    <!-- 日期选择弹框 -->
     <div class="find-time-box">
      <van-popup v-model="dateShow" position="bottom">
        <van-datetime-picker
           v-model="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
        >
          <template #default>
            <h3>设置时间</h3>
            <van-icon name="cross" size="25" @click="dateShow = false" />
          </template>
          <template #columns-bottom>
            <div class="button-box">
              <span @click="dateShow = false">取消</span>
              <span @click="onConDayFirm">确认</span>
            </div>
          </template>
        </van-datetime-picker>
      </van-popup>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { getEventList } from '@/api/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import SelectSearch from '@/components/SelectSearch'
export default {
  name: "EquipmentList",
  components: {
    NavBar,
    SelectSearch
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      dateQueryRangeShow: false,
      dateShow: false,
      equipmentStatusListEmptyShow: false,
      isShowEquipmentStatusNoMoreData: false,
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2100, 10, 1),
      currentDate: new Date(),
      timeOne: null,
      isLoadDataTime: null,
      totalCount: '',
      screenDialogShow: false,
      currentPage: 1,
      pageSize: 10,
      nameValue: '',
      isLoadData: true,
      currentListNameIndex: null,
      fullEquipmentStatusList: [],
      echoFullEquipmentStatusList: [],
      equipmentStatusList: [
        {
            name: '电梯',
            model: 'LEHY-II',
            status: '停机'
        },
        {
            name: '电梯2',
            model: 'LEHY',
            status: '停机待修'
        }
      ],
      timerShaftList: [
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        },
        {
            status: '正常运行',
            date: '2023-12-23',
            name: '张三'
        }
      ],
      statusValue: null,
      statusOption: [{text: '请选择',value: null},{text: '正常运行',value: 1},{text: '停机待续',value: 2}],
      selectStatusValue: {},
      statusDialogValue: null,
      statusDialogOption: [{text: '请选择',value: null},{text: '正常运行',value: 1},{text: '停机待续',value: 2}],
      selectStatusDialogReason: {},
      loadingShow: false,
      loadText: '加载中',
      calendarPng: require("@/common/images/home/calendar.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      dateIconPng: require("@/common/images/home/date-icon.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/home");
    this.$nextTick(()=> {
      this.initScrollChange()
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
	  });
    next() 
  },

  beforeDestroy () {
    if (this.timeOne) {
      clearTimeout(this.timeOne)
    };
    if (this.isLoadDataTime) {
      clearTimeout(this.isLoadDataTime)
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","patrolTaskListMessage","departmentCheckList"]),
    proId () {
      return this.userInfo.proIds[0]
    },
    userName () {
      return this.userInfo.name
    },
    workerId () {
      return this.userInfo.id
    }
  },

  methods: {
    ...mapMutations(["changeDepartmentCheckList","changePatrolTaskListMessage"]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/home'})
    },

    // 搜索事件
    searchEvent () {},

    // 状态弹框下拉框选值变化事件
    statusOptionChange (item) {
      this.selectStatusValue = item
    },

    // 弹框中的状态弹框下拉框选值变化事件
    statusDialogOptionChange (item) {
      this.selectStatusDialogValue = item
    },

    // 设备名称列点击事件
    listNameClickEvent (item,index) {
      this.currentListNameIndex = index;
      this.screenDialogShow = true;
      this.currentDate = new Date()
    },

    // 添加设备状态事件
    addEquipmentStatusEvent () {

    },

    // 格式化时间
    getNowFormatDate(currentDate) {
      let currentdate;
      let strDate = currentDate.getDate();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = currentDate.getMonth() + 1;
      let hour = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      };
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      };
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
      return currentdate
    },

    // 设置弹窗关闭前事件
    beforeCloseDialogEvent (action, done) {
      done()
    //   if (action == 'cancel') {
    //     done(false);
    //     return
    //   } else {
    //     done()
    //   }
    },

    // 设置弹窗确定事件
    screenDialogSure () {
      this.screenDialogShow = false
    },

    // 设置弹窗取消事件
    screenDialogCancel () {
      this.screenDialogShow = false
    },

    // 关闭设置弹框
    closeScreenDialogEvent () {
      this.screenDialogShow = false;
      this.dateShow = false
    },
    // 时间弹框确认事件
     onConDayFirm() {
      this.dateShow = false
    },

    // 日期类型范围选择确定
    onDateRangeConfirm(date) {
      const [start, end] = date;
      this.dateQueryRangeShow = false;
      this.currentDateRange = `${this.formatDate(start)} - ${this.formatDate(end)}`;
      this.currentStartDate = this.formatDate(start).replaceAll('/','-');
      this.currentEndDate = this.formatDate(end).replaceAll('/','-')
    },

    // 事件列表注册滚动事件
    initScrollChange () {
      let boxBackScroll = this.$refs['equipmentStatusList'];
      boxBackScroll.addEventListener('scroll',this.eventListLoadMore,true)
    },

    // 设备列表加载事件
    eventListLoadMore () {
      let boxBackScroll = this.$refs['equipmentStatusList'];
      if (Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight >= boxBackScroll.scrollHeight) {
        // 点击筛选确定后，不加载数据
        if (!this.isLoadData) {return};
        if (this.eventTime) {return};
        this.eventTime = 1;
        this.timeTwo = setTimeout(() => {
          let totalPage = Math.ceil(this.totalCount/this.pageSize);
          if (this.currentPage >= totalPage) {
          } else {
            this.isShowEquipmentStatusNoMoreData = false;
            this.currentPage = this.currentPage + 1;
          };
          this.eventTime = 0;
          console.log('事件列表滚动了',boxBackScroll.scrollTop, boxBackScroll.offsetHeight, boxBackScroll.scrollHeight)
        },300)
      }
    },

    // 获取历史任务列表
    queryEventList (page,pageSize,name='',startDate='',endDate='',eventType=[],registerType=[]) {
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadText = '加载中';
      this.equipmentStatusListEmptyShow = false;
      this.isShowBacklogTaskNoMoreData = false;
      getEventList({proId:this.userInfo.proIds[0], system: 6, 
        workerId: this.userInfo.id,page, limit:pageSize, name,
        startDate,endDate,eventType:eventType,registerType
      })
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadText = '';
            if (res && res.data.code == 200) {
                  this.equipmentStatusList = res.data.data.list;
                  this.totalCount = res.data.data.total;
                  this.fullEquipmentStatusList = this.fullEquipmentStatusList.concat(this.equipmentStatusList);
                  this.echoFullEquipmentStatusList = this.fullEquipmentStatusList;
                  if (this.fullEquipmentStatusList.length == 0) {
                    this.equipmentStatusListEmptyShow = true
                  }
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
        this.loadText = '';
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  height: 0;
  position: relative;
  .content-wrapper();
   // 日期选择弹框
   .find-time-box {
    /deep/ .van-popup {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      .van-picker {
        padding: 20px 10px;
        box-sizing: border-box;
        .van-picker__toolbar {
          h3 {
            display: flex;
            justify-content: space-around;
            font-size: 18px;
            width: 100%;
            line-height: 40px;
            color: #101010;
            height: 40px;
            position: relative;
            /deep/ .van-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0
            }
          }
        };
        .button-box {
          height: 60px;
          display: flex;
          width: 100%;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          >span {
              width: 40%;
              display: inline-block;
              height: 45px;
              font-size: 18px;
              line-height: 45px;
              background: #fff;
              text-align: center;
              border-radius: 30px;
              &:nth-child(1) {
                  color: #1864FF;
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                  margin-right: 40px
              };
              &:last-child {
                  color: #fff;
                  background: linear-gradient(to right, #6cd2f8, #2390fe);
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              }
          }
        }
      }
    }
    };
   // 设置弹框
   .screen-box {
    /deep/ .van-dialog {
      top: auto !important;
      left: 0 !important;
      border-right: 1px solid #fff;
      bottom: 0 !important;
      border-top-left-radius: 20px !important;
      border-top-right-radius: 20px !important;
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      transform: translate3d(0,0,0) !important;
      .van-dialog__content {
        padding: 0 4px 10px 4px !important;
        box-sizing: border-box;
        height: 50vh;
        display: flex;
        flex-direction: column;
        .dialog-top {
          height: 60px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .select-title {
            font-size: 14px;
            color: #101010;
            text-align: center
          };
          .van-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0
          }
        };
        .dialog-center {
           flex: 1;
           padding: 0 14px;
           box-sizing: border-box;
           display: flex;
           flex-direction: column;
           height: 0;
          .dialog-center-one-line {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            /deep/ .vue-dropdown {
                width: 30%;
                height: 30px;
                border-radius: 6px;
                border: 1px solid #BBBBBB !important;
                .cur-name {
                    font-size: 14px
                };
                .list-and-search {
                    font-size: 14px 
                }
            };
            .date-box {
                width: 55%;
                height: 30px;
                display: flex;
                align-items: center;
                .date-content {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    height: 30px;
                    border: 1px solid #BBBBBB;
                    background:#fff;
                    padding: 0 10px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    > span {
                        font-size: 14px;
                        color: #101010;
                        margin-right: 10px
                    };
                    img {
                        width: 19px;
                        height: 19px
                    }
                }
            }
          };
          .timer-shaft-list-box {
                width: 100%;
                flex: 1;
                overflow: auto;
                padding-top: 10px;
                box-sizing: border-box;
                .timer-shaft-list {
                    margin-bottom: 20px;
                    text-align: center;
                    >p {
                        &:first-child {
                            color: #101010;
                            font-size: 14px;
                            margin-bottom: 4px
                        };
                        &:last-child {
                            >span {
                                font-size: 12px;
                                &:first-child {
                                    color: #101010
                                };
                                &:last-child {
                                    color: #adadad
                                }
                            }
                        }
                    }
                }
          }
        }
      };
      .van-dialog__footer {
          padding: 20px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
            color: #1864FF;
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            background: #fff;
            border-radius: 30px;
            margin-right: 20px
        };
        .van-dialog__confirm {
            background: linear-gradient(to right, #6cd2f8, #2390fe);
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            color: #fff !important;
            border-radius: 30px;
        }
      };
      .van-hairline--top::after {
        border-top-width: 0 !important
      }
    }
  };
  /deep/ .van-overlay {
    z-index: 1000 !important
  };
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
        .content-top {
            width: 100%;
            padding: 6px 10px;
            box-sizing: border-box;
            background: #e8e8e8;
            .status-box {
                display: flex;
                align-items: center;
                >span {
                    font-size: 14px;
                    color: #101010;
                    display: inline-block;
                    text-align: center;
                    width: 40px
                };
                .vue-dropdown {
                    width: 40%;
                    border: 0.02667rem solid #BBBBBB !important;
                    height: 30px;
                    border-radius: 6px
                }
            };
            .name-box {
                display: flex;
                align-items: center;
                margin-top: 8px;
                >span {
                    font-size: 14px;
                    color: #101010;
                    display: inline-block;
                    text-align: center;
                    width: 40px
                };
                /deep/ .van-cell {
                    width: 60%;
                    height: 34px;
                    padding: 0 5px;
                    line-height: 34px;
                    border-radius: 6px;
                    border: 1px solid #BBBBBB;
                    margin-right: 10px
                }
            }
        };
        .list-title {
            display: flex;
            padding: 16px 6px;
            box-sizing: border-box;
            align-items: center;
            > span {
                font-size: 16px;
                font-weight: bold;
                flex: 1;
                text-align: center;
                color: #101010
            }
        };
        .backlog-task-list-box {
          overflow: scroll;
          flex: 1;
          height: 100%;
          box-sizing: border-box;
          position: relative;
          /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
          };
          .backlog-task-list {
               display: flex;
               padding: 12px 6px;
               box-sizing: border-box;
               align-items: center;
                > span {
                    display: inline-block;
                    font-size: 14px;
                    padding: 0 3px;
                    word-break: break-all;
                    flex: 1;
                    text-align: center;
                    color: #101010
                }
          };
          .listNameStyle {
            background: #BBBBBB !important
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
}
</style>