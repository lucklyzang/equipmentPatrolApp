<template>
  <div class="page-box" ref="wrapper">
    <div class="calendar-box" v-show="calendarShow">
        <div class="calendar-title">
            <span>请选择日期</span>
            <img :src="dateOtherIconPng" alt="">
        </div>
        <VueCalendar
            v-on:choseDay="clickDay"
            v-on:changeMonth="changeDate"
            v-on:isToday="clickToday"
            :markDate=noCompleteTaskDateList
        ></VueCalendar>
    </div>
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
            <div class="content-top">
                <div class="task-set-box">
                    <div class="task-set-name" :class="{'taskSetNameStyle': taskSetNameIndex == index }" v-for="(item,index) in allPatrolTaskDetailsData" :key="item.configId" @click="taskSetNameClickEvent(item,index)">
                        {{ item.configName }}
                    </div>
                </div>
                <div class="time-tab-box">
                    <div class="time-list-box">
                        <div class="time-list" :class="{'timetabStyle': timeTabIndex == index}" v-for="(item, index) in timeList" :key="item" @click="timeTabClickEvent(item,index)">{{ item }}</div>
                    </div>
                    <div class="calendar-icon">
                        <img :src="calendarPng" alt="" @click="dateClickEvent">
                    </div>
                </div>
            </div>
            <div class="task-content-box">
                <van-empty description="无巡检任务" v-if="isShowNoMoreData" />
                <div class="backlog-task-list-box">
                    <div class="backlog-task-list" v-for="(item,index) in currentTaskList" :key="index">
                        <div class="backlog-task-top">
                            <div class="backlog-task-top-left">
                                <span>{{ item.taskSite }}</span>
                            </div>
                            <div class="backlog-task-top-right" @click="clockInEvent">
                                <span :class="{'spanNoStartStyle': item.isClockIn == 0 }">{{ item.isClockIn == 0 ? '打卡' : '已打卡' }}</span>
                            </div>
                        </div>
                        <div class="backlog-task-content">
                            <div class="equipment-name-list" @click="equipmentChecklistEvent" v-for="(innerItem,innerIndex) in item.taskContentList" :key="innerIndex">
                                <div class="equipment-name">
                                    {{ `${innerItem.deviceName} ${innerItem.norms}` }}
                                </div>
                                <div class="operation-icon-box">
                                    <img :src="uploadingFailPng" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
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
import {getPatrolTaskDetailsList, resetPatrolTaskCalendarData} from '@/api/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import VueCalendar from '@/components/calendar/VueCalendar'
import { arrDateTimeSort } from "@/common/js/utils";
export default {
  name: "EquipmentPatrolDetails",
  components: {
    NavBar,
    VueCalendar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      calendarShow: false,
      overlayShow: false,
      taskSetNameIndex: 0,
      currentTaskSetId: '',
      timeTabIndex: 0,
      noCompleteTaskDateList: [],
      completeTaskDateList: [],
      allPatrolTaskDetailsData: [],
      timeList: [],
      currentTaskList: [],
      calendarPng: require("@/common/images/home/calendar-other.png"),
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
      dateOtherIconPng: require("@/common/images/home/date-other-icon.png"),
      uploadingFailPng: require("@/common/images/home/uploading-fail.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/home');
    let _this = this;
    document.addEventListener('click',function(e){
        if(e.target.className == 'van-overlay'){ 
            console.log('Jinqule1');
            _this.calendarShow = false;
            _this.overlayShow = false
        }
    });
    // 查询巡检任务详情
    this.queryPatrolTaskDetailsList(this.getNowFormatDate(new Date(),'day'))
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

    clickDay(data) {
     this.calendarShow = false;
     this.overlayShow = false;
      console.log('as',data); //选中某天
    },
    changeDate(data) {
        this.initCalendarData(this.getNowFormatDate(new Date(data),'month'))
       console.log('a1', data); //左右点击切换月份
    },
    clickToday(data) {
    },

    onClickLeft () {
        this.$router.push({path: '/home'})
    },

    onClickRight () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 任务集名称点击事件
    taskSetNameClickEvent (item,index) {
        this.taskSetNameIndex = index;
        this.currentTaskList = [];
        this.currentTaskSetId = item.configId;
        // 获取当前任务集的时间点集合,做升序处理
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == item.configId })[0]['deviceListByTime']));
        // 显示离任务时间最近的时间点
        this.timeTabIndex = this.timeList.indexOf(this.disposeTime(this.timeList));
        // 拼装当前时间段任务列表数据
        let currentTimeData = this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == item.configId })[0]['deviceListByTime'][this.disposeTime(this.timeList)];
        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
            taskSite: item,
            isClockIn: currentTimeData[item][0]['isClockIn'],
            taskContentList: currentTimeData[item]
        })})
    },

    // 时间tab切换事件
    timeTabClickEvent (item,index) {
        this.timeTabIndex = index;
        this.currentTaskList = [];
        // 拼装当前时间段任务列表数据
        let currentTimeData = this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == this.currentTaskSetId })[0]['deviceListByTime'][item];
        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
            taskSite: item,
            isClockIn: currentTimeData[item][0]['isClockIn'],
            taskContentList: currentTimeData[item]
        })})
    },

    // 日期图标点击事件
    dateClickEvent () {
        this.initCalendarData(this.getNowFormatDate(new Date(),'month'))
    },

    // 打卡事件
    clockInEvent () {

    },

    // 完成任务事件
    completeTaskEvent () {
        this.$router.push({path: '/patrolTaskElectronicSignaturePage'})
    },

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

    // 获取巡检任务详情
    queryPatrolTaskDetailsList (queryDate) {
        this.loadingShow = true;
        this.overlayShow = true;
		getPatrolTaskDetailsList({proId : this.userInfo.proIds[0], workerId: 6,state:-1,system:9,queryDate:'2023-07-20'})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
                if (res.data.data.length > 0) {
                    this.allPatrolTaskDetailsData = res.data.data;
                    // 获取初始任务集id
                    this.currentTaskSetId = this.allPatrolTaskDetailsData[0]['configId'];
                    // 获取当前任务集的时间点集合,做升序处理
                    this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[0]['deviceListByTime']));
                    // 显示离任务时间最近的时间点
                    this.timeTabIndex = this.timeList.indexOf(this.disposeTime(this.timeList));
                    // 拼装当前时间段任务列表数据
                    let currentTimeData = this.allPatrolTaskDetailsData[0]['deviceListByTime'][this.disposeTime(this.timeList)];
                    Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
                        taskSite: item,
                        isClockIn: currentTimeData[item][0]['isClockIn'],
                        taskContentList: currentTimeData[item]
                    })})
                } else {
                    this.isShowNoMoreData = true
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
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    },

    // 点击日历时对每天数据进行初始化
    initCalendarData (queryTime) {
        this.loadingShow = true;
        this.overlayShow = true;
		resetPatrolTaskCalendarData({proId : this.userInfo.proIds[0], workerId: 6,system:9,queryTime})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.noCompleteTaskDateList = [];
            this.completeTaskDateList = [];
            if (res && res.data.code == 200) {
                // 获取有未完成任务的日期
                Object.keys(res.data.data).forEach((item) => { if (res.data.data[item] == 1) { this.noCompleteTaskDateList.push(item)}});
                // 获取完成任务的日期
                Object.keys(res.data.data).forEach((item) => { if (res.data.data[item] == 0) { this.completeTaskDateList.push(item)}});
                this.calendarShow = true;
                this.overlayShow = true
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

    // 获取当前日期
    getNowFormatDate(currentDate,type) {
        let currentdate;
        let strDate;
        let seperator1 = "-";
        let month = currentDate.getMonth() + 1;
        strDate = currentDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        };
        if ( type == 'month') {
            currentdate = currentDate.getFullYear() + seperator1 + month
        } else {
            currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
        };
        return currentdate
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
      if (Object.prototype.toString.call(item) === '[object Array]') {
        if (item.length > 0) {
          let temporaryArr = [];
          // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
          if (new Date().getTime() >= new Date(this.getFullDate(item[item.length-1])).getTime()) {
            temporaryArr.push(item[item.length-1])
          } else {        
            for (let i=0, len = item.length; i<len; i++) {
              if (i > 0) {
                if (new Date().getTime() < new Date(this.getFullDate(item[i])).getTime()) {
                  temporaryArr.push(item[i-1])
                  break
                }
              }    
            }
          };
           console.log('当前时间',temporaryArr.join(','));    
          return temporaryArr.join(',')
        }
      }
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
  .calendar-box {
      position: absolute;
      z-index: 1000000;
      top: 20%;
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      .calendar-title {
        height: 35px;
        padding: 0 20px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        >span {
            font-size: 14px;
            color: #b3b3b3
        };
        >img {
            width: 16px
        }
      };
      /deep/ .wh_container {
      .wh_content_all {
        .wh_content {
            .wh_content_item {
                .wh_isToday {
                    background: transparent
                }
            }
        }
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
            .task-set-box {
                background: #fff;
                padding: 10px 14px 0 14px;
                box-sizing: border-box;
                align-items: flex-start;
                flex-wrap: nowrap;
                display: flex;
                overflow-x: auto;
                white-space: nowrap;
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
                    border-radius: 4px
                }
            };
            .time-tab-box {
                display: flex;
                height: 45px;
                background: #fff;
                align-items: center;
                border-right: 1px solid #333;
                border-left: 1px solid #333;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                .bottom-border-1px(#BEC7D1);
                .time-list-box  {
                    flex: 1;
                    display: flex;
                    flex-wrap: nowrap;
                    height: 45px;
                    padding-left: 14px;
                    box-sizing: border-box;
                    align-items: center;
                    overflow-x: auto;
                    white-space: nowrap;
                    &::-webkit-scrollbar {
                        height: 0;
                        display: none
                    };
                    .time-list {
                        height: 45px;
                        padding: 0 6px;
                        box-sizing: border-box;
                        line-height: 45px;
                        margin-right: 20px;
                        font-size: 14px;
                        color: #101010;
                        flex-shrink: 0
                    };
                    .timetabStyle {
                        color: #0379FF;
                        border-bottom: 4px solid #0379FF
                    }
                };
                .calendar-icon {
                    width: 24px;
                    margin-right: 4px;
                    >img {
                        width: 100%
                    }
                }
            };
            .taskSetNameStyle {
                color: #0379FF !important;
                border: 1px solid #0379FF !important
            }
        };    
        .task-content-box {
            flex: 1;
            padding: 12px 4px 0px 4px;
            box-sizing: border-box;
            background: #f7f7f7;
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
                                background: #0A7AF5 !important;
                                border-radius: 4px;
                                text-align: center !important;
                                color: #fff !important
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