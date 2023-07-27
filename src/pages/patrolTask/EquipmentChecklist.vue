<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <van-nav-bar title="设备检查单" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
          <div class="current-area">
            <van-icon name="location" color="#1684FC" size="25" />
            <span>当前检查设备: {{ currentPatrolTaskDeviceChecklist.deviceName }}</span>
          </div>
          <div class="equipment-list-box">
            <div class="equipment-classification-box">
              <div class="equipment-classification-list" v-for="(item,index) in currentPatrolTaskDeviceChecklist.checkItemListGroupByCheckType" :key="index">
                <div class="equipment-classification-name">{{ `#${item.checkItemClassifyName}` }}</div>
                <div class="equipment-list" v-for="(innerItem,innerIndex) in item.checkItemClassifyContent" :key="innerIndex">
                  <div class="equipment-operation-box" @click="checkItemNameRowCkickEvent(index,innerItem,innerIndex)">
                    <div class="operation-left">
                      <img :src="innerItem.unfold ? arrowGreenBottomPng : arrowGreenRightPng" alt="">
                      <span>{{ innerItem.itemName }}</span>
                    </div>
                    <div class="operation-right">
                      <van-radio-group v-model="innerItem.checkResult" direction="horizontal">
                          <van-radio name="1" @click="(event) => passEvent(event,innerItem,innerIndex)">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                              </template>
                          </van-radio>
                          <van-radio name="3" @click="(event) => noPassEvent(event,innerItem,innerIndex)">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                              </template>
                          </van-radio>
                      </van-radio-group>
                    </div>
                  </div>
                  <div class="examine-standard-box" v-show="innerItem.unfold">
                    <div class="examine-standard-top">
                      <p>标准与要求:</p>
                      <p>{{ innerItem.itemStandard }}</p>
                    </div>
                    <div class="examine-standard-bottom">
                      <p>检查方法及工具:</p>
                      <p>触摸、听音、目视</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="remark-box">
            <span>备注</span>
              <van-field
                v-model="remarkContent"
                rows="2"
                maxlength="500"
                show-word-limit
                autosize
                type="textarea"
                placeholder="请输入"
              />
            </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-complete">保 存</div>
    </div>
    <!-- 退出提示框   -->
    <div class="quit-info-box">
      <van-dialog v-model="quitInfoShow"  show-cancel-button width="85%"
          @confirm="quitSure" @cancel="quitCancel" confirm-button-text="是"
          cancel-button-text="否"
        >
          <div class="dialog-title">
            该检查单未填写完毕,是否要退出?
          </div>
          <div class="dialog-center">
            退出后您还可以再次进入进行填写，本次填写的内容将被保留，但未将检查项全部勾选之前您将无法完成该巡检任务 
          </div>
      </van-dialog>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { checkItemPass, checkItemNoPass, getIsHaveEventRegister} from '@/api/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
export default {
  name: "EquipmentChecklist",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      quitInfoShow: false,
      currentPatrolTaskDeviceChecklist: {},
      remarkContent: '',
      loadText: '加载中',
      arrowGreenBottomPng: require("@/common/images/home/arrow-green-bottom.png"),
      arrowGreenRightPng: require("@/common/images/home/arrow-green-right.png"),
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/equipmentPatrolDetails");
    this.currentPatrolTaskDeviceChecklist = this.patrolTaskDeviceChecklist;
    let temporaryCheckItemListGroupByCheckType = this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'];
    this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'] = [];
    Object.keys(temporaryCheckItemListGroupByCheckType).forEach((item) => {
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].push({
        checkItemClassifyName: item,
        checkItemClassifyContent: temporaryCheckItemListGroupByCheckType[item]
      })
    });
    this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach(el => {
      el.checkItemClassifyContent.forEach((innerEl) => {
        innerEl.unfold = false
      })
    });
    console.log('处理后数据',this.currentPatrolTaskDeviceChecklist);
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","patrolTaskDeviceChecklist"])
  },

  methods: {
    ...mapMutations(['changeEnterPatrolAbnormalRecordPageSource','changePatrolTaskListMessage','changePatrolTaskDeviceChecklist']),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.quitInfoShow = true;
      return;
      this.$router.push({path: '/equipmentPatrolDetails'})
    },

    // 确定退出
    quitSure () {
      this.$router.push({path: '/equipmentPatrolDetails'})
    },

    // 取消退出
    quitCancel () {

    },

    // 检查项名称行点击事件
    checkItemNameRowCkickEvent (index,innerItem,innerIndex) {
      this.$nextTick(() => {
        this.$set(this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex], 'unfold',!this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex]['unfold'])
      });
      this.$forceUpdate()
    },

    // 判断该巡查项下是否有登记事件
    queryIsHaveEventRegister (event,innerItem,innerIndex) {
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadText = '查询中';
      getIsHaveEventRegister(this.userInfo.proIds[0],6,innerItem.resultId).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadText = '';
        if (res && res.data.code == 200) {
          // 该巡查项下面有登记事件该巡查项无法再由X改为√。如果把登记的事件全部删除了，那就可以由X改为√。
          if (res.data.data == 1) {
            this.$toast({
              type: 'fail',
              message: '该巡查项下面有异常记录,把该巡查项下登记的异常记录全部删除后,方能通过'
            });
            // 重置该检查项选中状态
            item['checkResult'] = '3';
            return
          };
          this.loadingShow = true;
          this.overlayShow = true;
          this.loadText = '反馈中';
          checkItemPass({resultId:item.resultId,workerName: this.userInfo.name}).then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadText = '';
            if (res && res.data.code == 200) {
              this.$toast({
                type: 'success',
                message: '反馈成功'
              });
              // 更改该检查项选中状态
              let tempraryMessage = deepClone(this.departmentCheckList);
              tempraryMessage['checkItemList'][index]['checkResult'] = '1';
              this.changeDepartmentCheckList(tempraryMessage)
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
    },

    // 通过事件
    passEvent (event) {
      // 判断该巡查项下是否有登记事件
      this.queryIsHaveEventRegister(event,innerItem,innerIndex)
    },

    // 不通过事件
    noPassEvent (event,innerItem,innerIndex) {
      // this.changeEnterPatrolAbnormalRecordPageSource('/equipmentChecklist');
      // this.$router.push({path: '/patrolAbnormalRecord'});
      // this.$router.push({path: '/patrolAbnormalCheckItemEventList'});
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadText = '反馈中';
      checkItemNoPass({resultId:innerItem.resultId,workerName: this.userInfo.name}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadText = '';
        if (res && res.data.code == 200) {
          this.$toast({
            type: 'success',
            message: '反馈成功'
          });
          this.resultId = item['resultId'];
          //保存进入问题记录页的相关信息
          let temporaryInfo = this.enterProblemRecordMessage;
          temporaryInfo['isAllowOperation'] = true;
          temporaryInfo['enterProblemRecordPageSource'] = '/areaPatrolDetails';
          temporaryInfo['issueInfo'] = item;
          temporaryInfo['id'] = res.data.data ? res.data.data.id : null;
          temporaryInfo['index'] = index; 
          this.changeEnterProblemRecordMessage(temporaryInfo);
          // 第一次点击X，直接选择事件类型进行登记
          if (this.departmentCheckList['checkItemList'][index]['checkResult'] == 0 || this.departmentCheckList['checkItemList'][index]['checkResult'] == 1) {
            this.patrolItem = this.enterProblemRecordMessage['issueInfo']['name'];
            this.eventTypeShow = true
          } else {
            // 第二次及以上再点击X，进入异常巡查项事件列表页
            this.$router.push({path: '/problemRecord'})
          };
          // 更改该检查项选中状态
          let tempraryMessage = deepClone(this.departmentCheckList);
          tempraryMessage['checkItemList'][index]['checkResult'] = '3';
          this.changeDepartmentCheckList(tempraryMessage)
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
   .quit-info-box {
    /deep/ .van-dialog {
      .van-dialog__content {
          padding: 20px 16px 0 16px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .dialog-title {
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
            color: #101010;
            font-size: 16px;
          };
          .dialog-center {
            line-height: 20px;
            padding: 20px 0;
            box-sizing: border-box;
            color: #101010;
            font-size: 12px
          }
        };
        .van-dialog__footer {
          padding: 10px 40px 20px 40px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
          height: 40px;
          background: #3B9DF9;
          color: #fff !important;
          border-radius: 8px;
          margin-right: 20px
        };
        .van-dialog__confirm {
           height: 40px;
            color: #3B9DF9;
            border: 1px solid #3B9DF9;
            border-radius: 8px
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
      .current-area {
        height: 54px;
        line-height: 54px;
        width: 94%;
        margin: 0 auto;
        font-size: 14px;
        color: #101010;
        /deep/ .van-icon {
          vertical-align: middle
        };
        >span {
          vertical-align: middle
        }
      };
      .equipment-list-box {
        background: #fff;
        flex: 1;
        overflow: auto;
        .equipment-classification-box {
          .equipment-classification-list {
            .equipment-classification-name {
              border-bottom: 4px solid #f7f7f7;
              font-size: 12px;
              color: #848484;
              padding: 6px 4px;
              box-sizing: border-box
            };
            .equipment-list {
              .equipment-operation-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 44px;
                padding: 0 6px;
                box-sizing: border-box;
                border-bottom: 4px solid #f7f7f7;
                .operation-left {
                  img {
                    width: 22px;
                    margin-right: 4px;
                    vertical-align: middle
                  };
                  span {
                    color: #494D51;
                    font-size: 14px;
                    vertical-align: middle
                  }
                };
                .operation-right {
                  /deep/ .van-radio-group {
                    .van-radio {
                      .van-radio__icon {
                        height: auto !important
                      };
                      img {
                        width: 30px
                      }
                    };
                    >div {
                      margin-right: 20px;
                      &:last-child {
                          margin-right: 0
                      }
                    }
                  }
                }
              };
              .examine-standard-box {
                background: #f5f5f5;
                padding: 6px;
                box-sizing: border-box;
                .examine-standard-top {
                  p {
                    color: #101010;
                    font-size: 12px;
                    margin-bottom: 4px;
                    &:last-child {
                      word-break: break-all
                    }
                  }
                };
                .examine-standard-bottom {
                  margin-top: 10px;
                  p {
                    color: #101010;
                    font-size: 12px;
                    margin-bottom: 4px;
                    &:last-child {
                      word-break: break-all
                    }
                  }
                }
              }
            }
          }
        }
      };
      .remark-box {
        display: flex;
        background: #fff;
        padding: 8px;
        box-sizing: border-box;
        margin-top: 4px;
        > span {
          width: 40px;
          font-size: 14px;
          color: #101010
        };
        /deep/ .van-cell {
          flex: 1;
          background: #f5f5f5
        }
      }
    }    
  };
  .task-operation-box {
    height: 80px;
    display: flex;
    background: #F7F7F7;
    width: 100%;
    z-index: 100;
    align-items: center;
    justify-content: center;
    .task-complete {
      width: 60%;
      height: 42px;
      line-height: 42px;
      background: #fff;
      font-size: 16px;
      text-align: center;
      border-radius: 30px;
      color: #fff;
      background: linear-gradient(to right, #6cd2f8, #2390fe);
      box-shadow: 0px 2px 6px 0px rgba(36, 149, 213, 1)
    }
  }
}
</style>