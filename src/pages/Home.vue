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
            <h2>任务看板</h2>
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
                currentMessageNumber: 0,
                isShowMessageNumber: false,
                isTimeoutContinue: true,
                cleaningManagementList: [
                    {
                        name: '设备巡检',
                        imgUrl: require("@/common/images/home/task-list.png")
                    },
                    {
                        name: '设备点检',
                        imgUrl: require("@/common/images/home/event-registration.png")
                    },
                    {
                        name: '设备管理',
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
        },

        mounted() {
            // 二维码回调方法绑定到window下面,提供给外部调用
            let me = this;
            window['scanQRcodeCallback'] = (code) => {
                me.scanQRcodeCallback(code);
            };
            window['scanQRcodeCallbackCanceled'] = () => {
                me.scanQRcodeCallbackCanceled();
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

            // 头像点击事件
            userInfoEvent () {
                this.$router.push({path: '/myInfo'})
            },
            
            // 扫描二维码方法
            scanQRCode () {
                window.android.scanQRcode()
            },

            // 巡查任务点击事件
            patrolTaskEvent (item, index) {
                if (item.name == '设备巡检') {
                    this.$router.push({path: '/equipmentPatrolDetails'})
                } else if (item.name == '设备点检') {
                    this.$router.push({path: '/equipmentSpotCheck'})
                } else if (item.name == '设备管理') {
                    this.$router.push({path: '/equipmentList'})
                } else if (item.name == '调度管理') {
                    this.$router.push({path: '/equipmentSpotList'}) 
                }
            },

            // 摄像头扫码后的回调
            scanQRcodeCallback(code) {
                if (code) {
                    let codeData = code.split('|');
                    try {
                
                    } catch (err) {
                        this.$toast({
                            message: `${err}`,
                            type: 'fail'
                        })
                    }  
                } else {
                    this.$dialog.alert({
                        message: '当前没有扫描到任何信息,请重新扫描'
                    }).then(() => {
                        this.scanQRCode()
                    })
                }
            },

            // 摄像头取消扫码后的回调
            scanQRcodeCallbackCanceled () {
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
                        font-size: 20px
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
                        color: #E86F50;
                        border: 1px solid #E86F50;
                        border-radius: 8px;
                        margin-right: 40px
                    };
                    .van-dialog__confirm {
                        height: 40px;
                        background: #E86F50;
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
                        width: 68px;
                        margin: 0 20px;
                        border-radius: 50%;
                        z-index: 1000;
                        img {
                            vertical-align: middle;
                            width: 68px
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
                    border: 1px solid #E86F50;
                    border-radius: 8px;
                    color: #E86F50
                }
            }    
        }
    }
</style>