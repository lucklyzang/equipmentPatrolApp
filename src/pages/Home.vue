<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
        <NavBar title="设备巡检系统" :leftArrow="false" leftText="" />
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
			<div class="content-top-content" @click="userInfoEvent">
				<div class="user-photo">
					<img :src="defaultPersonPng" />
				</div>
				<div class="user-message">
					<div class="user-name">
						{{ userInfo.name }}
					</div>
					<div class="account-name">
						{{ hospitalMessage.hospitalName }} {{ `${hospitalMessage.name}` }}
					</div>
				</div>
			</div>
		</div>
        <div class="task-board">
            <h2>全部功能</h2>
            <div class="subproject-list-box">
                <div class="subproject-list" v-for="(item,index) in cleaningManagementList" 
                    :key="index"
                    @click="patrolTaskEvent(item,index)"
                >
                    <img :src="item.imgUrl" alt="">
                    <span>{{ item.name }}</span>
                    <span class="message-number" v-show="isShowMessageNumber && item.name == '留言簿' ">{{ messageNumber }}</span>
                </div> 
            </div>
        </div>
        <div class="quit-btn-box">
            <div class="quit-btn" @click="quitClickEvent">
                退出账号
            </div>
        </div>
    </div>
    <!-- 是否退出登录提示框   -->
    <div class="quit-info-box">
       <van-dialog v-model="quitInfoShow"  show-cancel-button width="90%"
          @confirm="quitSure" @cancel="quitCancel"
        >
          <div class="dialog-top">
            <span>是否退出？</span>
          </div>
        </van-dialog>
    </div>
  </div>
</template>
<script>
    import NavBar from "@/components/NavBar";
    import {
	    userSignOut
    } from '@/api/login.js' 
    import { queryNewCount } from '@/api/escortManagement.js'
    import { removeAllLocalStorage } from "@/common/js/utils";
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    export default {
        name: 'Home',
        components: {
            NavBar
        },
        data() {
            return {
                loadingShow: false,
                overlayShow: false,
                quitInfoShow: false,
                messageNumber: 0,
                windowTimer: null,
                currentMessageNumber: 0,
                isShowMessageNumber: false,
                isTimeoutContinue: true,
                cleaningManagementList: [
                    {
                        name: '巡更任务',
                        imgUrl: require("@/common/images/home/task-list.png")
                    },
                    {
                        name: '事件登记',
                        imgUrl: require("@/common/images/home/event-registration.png")
                    },
                    {
                        name: '排班管理',
                        imgUrl: require("@/common/images/home/workforce-management.png")
                    },
                    {
                        name: '调度管理',
                        imgUrl: require("@/common/images/home/guest-book.png")
                    }
                ],
                defaultPersonPng: require("@/common/images/home/default-person.png"),
                statusBackgroundPng: require("@/common/images/home/status-background.png")
            }
        },

        beforeDestroy () {
            if (this.windowTimer) {
                clearInterval(this.windowTimer)
            }
        },

        mounted() {
            // 轮询是否有当前登录用户参与任务集下新的留言
            if (!this.windowTimer) {
                this.windowTimer = window.setInterval(() => {
                    if (this.isTimeoutContinue) {
                        setTimeout(this.queryNewMessage, 0)
                    }
                }, 3000);
                this.changeGlobalTimer(this.windowTimer)
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin',
                'hospitalMessage',
                'isEnterGuestBookPageFromHomePage',
                'lastMessageNumber'
            ]),

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
            ...mapMutations([
                "changeChooseProject",
                'changeGlobalTimer',
                'changeIsEnterGuestBookPageFromHomePage',
                'changeLastMessageNumber',
                'changeOverDueWay'
            ]),

            // 退出账号事件
            quitClickEvent () {
                this.quitInfoShow = true
            },

            // 退出登录弹框确定事件
            quitSure () {
                this.loadingShow = true;
                this.overlayShow = true;
                this.changeOverDueWay(true);
                userSignOut().then((res) => {
                    this.loadingShow = false;
                    this.overlayShow = false;
                    if (res && res.data.code == 200) {
                        removeAllLocalStorage();
                        if(this.globalTimer) {window.clearInterval(this.globalTimer)};
                                this.$router.push({path: '/'})
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            type: 'fail'
                        });
                        this.changeOverDueWay(false)
                    }
                }).
                catch((err) => {
                    this.$toast({
                        message: `${err}`,
                        type: 'fail'
                    });
                    this.changeOverDueWay(false);
                    this.loadingShow = false;
                    this.overlayShow = false
                })
            },

            // 退出登录弹框取消事件
            quitCancel () {

            },

            // 查询是否有当前登录用户参与任务集下新的留言
            queryNewMessage () {
                this.isTimeoutContinue = false;
                queryNewCount({userId: this.workerId, system:6, proId: this.proId}).then((res) => {
                    if (res && res.data.code == 200) {
                        this.isTimeoutContinue = true;
                        // 实时总留言数量
                        this.currentMessageNumber = res.data.data;
                        if (res.data.data > 0) {
                            // 有新增留言
                            if (this.lastMessageNumber != null && (this.lastMessageNumber != res.data.data)) {
                                // 重置是否从首页进入过留言页
                                this.changeIsEnterGuestBookPageFromHomePage(false);
                                // 显示新的留言数量
                                this.messageNumber = (res.data.data - this.lastMessageNumber) >= 0 ? (res.data.data - this.lastMessageNumber) : 0;
                                this.isShowMessageNumber = this.messageNumber > 0 ? true : false
                            } else {
                              // 记录留言数量没变化前的留言数量
                              this.changeLastMessageNumber(res.data.data);
                              // 去过留言簿页就默认读过留言
                               if (this.isEnterGuestBookPageFromHomePage) {
                                   this.isShowMessageNumber = false
                               } else {
                                   this.messageNumber = (res.data.data - this.lastMessageNumber) >= 0 ? (res.data.data - this.lastMessageNumber) : 0
                                   this.isShowMessageNumber = this.messageNumber > 0 ? true : false
                               }
                            }
                        } else {
                            this.isShowMessageNumber = false
                        }
                    }
                })
                .catch((err) => {
                    this.$dialog.alert({
                        message: `${err}`,
                        closeOnPopstate: true
                    }).then(() => {
                    })
                })
            },

            // 头像点击事件
            userInfoEvent () {
                this.$router.push({path: '/myInfo'})
            },

            // 巡查任务点击事件
            patrolTaskEvent (item, index) {
                if (item.name == '巡更任务') {
                    this.$router.push({path: '/patrolTasklist'})
                } else if (item.name == '事件登记') {
                    this.$router.push({path: '/eventList'})
                } else if (item.name == '调度管理') {
                    this.changeIsEnterGuestBookPageFromHomePage(true);
                    // 记录留言数量没变化前的留言数量(进入留言簿页面后默认读过所有新留言)
                    this.changeLastMessageNumber(this.currentMessageNumber);
                    this.$router.push({path: '/guestBook'})
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    @import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
    .page-box {
        background: #F8F8F8;
        .content-wrapper();
        .nav {
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 10;
            left: 0;
            /deep/ .van-nav-bar {
                .van-nav-bar__left {
                    .van-nav-bar__text {
                        color: #fff !important;
                        margin-left: 8px !important;
                    }
                }
                .van-nav-bar__title {
                    color: #fff !important;
                    font-size: 18px !important;
                    font-weight: bold
                }
            }
        };
        .quit-info-box {
            /deep/ .van-dialog {
            .van-dialog__content {
                padding: 30px 16px 20px 16px !important;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                .dialog-top {
                    line-height: 20px;
                    padding: 20px 0 20px 0;
                    text-align: center;
                    box-sizing: border-box;
                    > span {
                        color: #101010;
                        font-size: 18px;
                        font-weight: bold
                    };
                    img {
                        vertical-align: top;
                        margin-top: -2px;
                        width: 24px;
                        height: 24px
                    }
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
                        color: #e22626;
                        border: 1px solid #e22626;
                        border-radius: 8px;
                        margin-right: 40px
                    };
                    .van-dialog__confirm {
                        height: 40px;
                        background: #e22626;
                        color: #fff;
                        border-radius: 8px
                    }
                };
                .van-hairline--top::after {
                    border-top-width: 0 !important
                }
            }
        };
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            .content-top-area {
                position: relative;
                width: 100%;
                margin: 0 auto;
                height: 189px;
                > img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .content-top-content {
                    width: 95%;
                    padding: 20px 0;
                    box-sizing: border-box;
                    overflow: auto;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 125px;
                    margin: 0 auto;
                    top: 80px;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    background: #fff;
                    box-shadow: 0px 2px 8px -1px rgba(11, 64, 173, 0.31);
                    .user-photo {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 70px;
                        margin: 0 20px;
                        height: 70px;
                        border-radius: 50%;
                        z-index: 1000;
                        img {
                            vertical-align: middle;
                            width: 70px;
                            height: 70px;
                        }
                    };
                    .user-message {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        z-index: 100;
                        color: #101010;
                        height: 60px;
                        flex: 1;
                        .user-name {
                            width: 98%;
                            word-break: break-all;
                            font-size: 16px;
                            font-weight: bold
                        }
                        .account-name {
                            width: 98%;
                            word-break: break-all;
                            font-size: 14px;
                            margin-top: 20px;
                            color: #BEC7D1;
                            line-height: 20px
                        }
                    }
                }
            };
           .task-board {
                width: 95%;
                background: #fff;
                border-radius: 8px;
                flex: 1;
                margin: 0 auto;
                margin-top: 40px;
                padding-bottom: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                h2 {
                    width: 100%;
                    height: 55px;
                    padding-left: 26px;
                    box-sizing: border-box;
                    line-height: 55px;
                    font-size: 16px;
                    color: #242424;
                    font-weight: bold;
                };
                .subproject-list-box {
                    width: 100%;
                    display: flex;
                    flex-flow: row wrap;
                    flex: 1;
                    align-content: flex-start;
                    .subproject-list {
                        position: relative;
                        width: 33.3%;
                        display: flex;
                        margin-bottom: 25px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        >img {
                            width: 50px;
                            height: 50px;
                            margin-left: 6px;
                        };
                        >span {
                            &:nth-child(2){
                                margin-top: 14px;
                                font-size: 16px;
                                color: #101010;
                                text-align: center
                            };
                            &:nth-child(3) {
                                position: absolute;
                                width: 70px;
                                .no-wrap();
                                top: -10px;
                                right: -10px;
                                font-size: 16px;
                                color: red;
                                padding-left: 22px;
                                display: inline-block;
                                box-sizing: border-box
                            }
                        }
                    };
                    >div:nth-child(5) {
                        width: 35% !important
                    }
                }
            };
            .quit-btn-box {
                height: 300px;
                display: flex;
                align-items: flex-end;
                padding-bottom: 60px;
                box-sizing: border-box;
                .quit-btn {
                    height: 40px;
                    width: 70%;
                    margin: 0 auto;
                    text-align: center;
                    line-height: 40px;
                    font-size: 14px;
                    border: 1px solid #e22626;
                    border-radius: 8px;
                    color: #e22626
                }
            }    
        }
    }
</style>