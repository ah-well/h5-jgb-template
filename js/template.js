var input_upload = document.createElement("input");
input_upload.type = 'file';
input_upload.id = 'd1';
var isEdit = "0";
$(function () {
    input_upload.addEventListener('change', function (e) {
        document.getElementById('aisle').style.display = 'none';
        $("#gcjDhccFullScreen").show();
        setTimeout(function() {
            ajax_upload_image(input_upload);
        }, 2000);
    });
    $("#gcjDhccFullScreen").hide();

    // 是否模板
    var isBase = getReqParam("isBase");
    if (!isBase || isBase != "1") {
        $("#useTemplate").hide();
    }

    // 是否可编辑
    isEdit = getReqParam("isEdit");
    if (!isEdit || isEdit != "1") {
        $("#pubTemplate").hide();
    }
});

function updatePhoto(id) {
    if (!isEdit || isEdit != "1") {
        return;
    }
    document.getElementById('aisle').style.display = 'block';
    input_upload.id = id;
};

function upload() {
    if (!isEdit || isEdit != "1") {
        return;
    }
    input_upload.accept = 'image/*;capture=camera';
    input_upload.click();
};

function updateAudio(id) {
    if (!isEdit || isEdit != "1") {
        return;
    }
    document.getElementById('audio').style.display = 'block';
    input_upload.id = id;
};

function uploadAudio() {
    if (!isEdit || isEdit != "1") {
        return;
    }
    input_upload.accept = 'audio/*';
    input_upload.click();
};

function init_camera() {
    if (!isEdit || isEdit != "1") {
        return;
    }
    input_upload.accept = 'image/*'
    input_upload.click();
};

function ajax_upload_image(e) {
    var tokenId = getToken();
    var file = e.files ? e.files[0] : e.path[0].files[0];
    var formData = new FormData()
    formData.append("file", file);
    $.ajax({
        url: 'https://resources.kingubo.net/app/api/file/upload?access_token=' + tokenId + '&userId=0&typeId=&typeName=',
        type: 'post',
        contentType: "multipart/form-data",
        dataType: 'JSON',
        async: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function(obj) {
            var id = input_upload.id;
            var image_url = obj.files[0].thumbnail;
            var image_yt = obj.files[0].pdf;
            if (id == "audio_btn") {
                document.getElementById("media").src = image_yt;
                document.getElementById('audio').style.display = 'none';
            } else {
                document.getElementById(id).src = image_yt;
            }
            $("#gcjDhccFullScreen").hide();
        }
    });
};
/**
 * 获取Token
 */
function getToken() {
    var tokenId = "";
    $.ajax({
        headers: {
            "Authorization": "Basic a2luZ3Vib2FwcDpraW5ndWJv"
        },
        type: "post",
        url: "https://resources.kingubo.net/app/api/file/oauth/token?username=15913201924@001009&password=111111&grant_type=password",
        data: {},
        async: false,
        error: function(request) {
            alert("Connection error");
        },
        success: function(resp) {
            tokenId = resp["access_token"];
        }
    });
    return tokenId;
};
var templateURL = "http://192.168.1.61:3060/app/";
// var templateURL = "https://www.kingubo.com/jvapi/app/";

/**
 * 使用此模板
 */
function useTemplate() {
    var myDate = new Date();
    var userId = myDate.getMonth() + "" + myDate.getDate() + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds();
    var pathName = window.location.pathname;
    pathName = pathName.substring(pathName.lastIndexOf("/") + 1);
    $.ajax({
        type: "post",
        url: templateURL + "api/template/useTemplate",
        data: {
            "id": pathName,
            "userId": userId
        },
        error: function(request) {
            alert("Connection error");
        },
        success: function(resp) {
            window.location.href = resp.result;
        }
    });
};
/**
 * 发布
 */
function pubTemplate() {
    $("body").attr('class',"viewing-page-1");
    var pathName = window.location.pathname;
    pathName = pathName.substring(pathName.lastIndexOf("/") + 1);
    var html = document.getElementsByTagName('html')[0].innerHTML;
    var judge = prompt("请输入网站名称");
    if (!judge || judge == "") {
        alert("请输入网站名称");
        return;
    }
    $.ajax({
        type: "post",
        url: templateURL + "api/template/pubTemplate",
        data: {
            "id": pathName,
            "html": html,
            "name": judge
        },
        error: function(request) {
            alert("Connection error");
        },
        success: function (resp) {
          alert(resp.result);
          window.location.href = "../newhtml/cocMember/memberList.html";
        }
    });
};
/**
 * 获取URL参数
 * @param {*} field
 */
function getReqParam(field) {
    var reg = new RegExp("(^|&)" + field + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
/**
 * 长按dom元素触发
 * @param {*} field
 */
// 文本id
var textId = '';
var timeOutEvent = 0; //定时器
//开始按
function gtouchstart(e) {
    //console.log(e)
    timeOutEvent = setTimeout(() => {
        timeOutEvent = 0;
        console.log("长按时间 > 500ms,触发事件");
        if (e == "audio_btn") {
            updateAudio('audio_btn');
        } else if (e.indexOf("-image") != -1) {
            updatePhoto(e);
        } else {
            showTextarea(e);
            textId = e
        }
        //执行长按要执行的内容，如弹出菜单
        // showTextarea()
    }, 500); //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
    return false;
};
//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
function gtouchend() {
    clearTimeout(timeOutEvent); //清除定时器
    if (timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
        console.log("长按时间 < 500ms,不触发事件")
    }
    return false;
};
//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
function gtouchmove() {
    clearTimeout(timeOutEvent); //清除定时器
    timeOutEvent = 0;
};
//真正长按后应该执行的内容
function longPress() {
    timeOutEvent = 0;
    //执行长按要执行的内容，如弹出菜单
    console.log("长按触发指定函数");
}
// 显示出替换文本框
function showTextarea(e) {
    if (!isEdit || isEdit != "1") {
        return;
    }
    $(".text-box").show()
}
// 点击取消隐藏文本框
function cancelText() {
    $(".text-box").hide()
}
function confirmText(){
    var text = $("#input-upload-text").val()
    console.log(text)
    console.log(textId)
    document.getElementById(textId).innerHTML = text
    $(".text-box").hide()
    $("#input-upload-text").val('')
}



var num=0;
$('#audio_btn').click(function(e){
    if(num++ % 2 == 0){
        // 暂停播放，移除旋转效果
        $(this).removeClass("rotate")
        $("#media").get(0).pause()
    }else{
        // 开始播放，添加旋转效果
        $(this).addClass("rotate")
        $("#media").get(0).play()
    }
    e.preventDefault(); //阻止元素的默认动作（如果存在）
});
// $(function(){
//     var voice = document.getElementById('media');
//     voice.play()
//     //调用 <audio> 元素提供的方法 play()
//     //判斷 WeixinJSBridge 是否存在
//     // if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
//     //     voice.play();
//     // } else {
//     //     //監聽客户端抛出事件"WeixinJSBridgeReady"
//     //     if (document.addEventListener) {
//     //         document.addEventListener("WeixinJSBridgeReady", function(){
//     //             voice.play();
//     //         }, false);
//     //     } else if (document.attachEvent) {
//     //         document.attachEvent("WeixinJSBridgeReady", function(){
//     //             voice.play();
//     //         });
//     //         document.attachEvent("onWeixinJSBridgeReady", function(){
//     //             voice.play();
//     //         });
//     //     }
//     // }
//     // $('#audio_btn').click(function() {
//     //     // 依據 audio 的 paused 属性返回音频是否已暂停來判斷播放還是暫停音频。
//     //     console.log(voice.paused)
//     //     if (voice.paused) {
//     //         voice.play();
//     //     } else {
//     //         voice.pause();
//     //     }
//     // });
//     //
//     // $('#shakingAudio').play();
//    // document.addEventListener('WeixinJSBridgeReady',function(){
//    //         voice.play();
//    // },false);

//    wx.config({
//         // 配置信息, 即使不正确也能使用 wx.ready
//         debug: false,
//         appId: '',
//         timestamp: 1,
//         nonceStr: '',
//         signature: '',
//         jsApiList: []
//     });
//     wx.ready(function() {
//         document.getElementById('media').load()
//         document.getElementById('media').play();
//     });
//     // 判斷 WeixinJSBridge 是否存在
//     if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
//         document.getElementById('media').voice.load()
//         document.getElementById('media').voice.play();
//     } else {
//         //監聽客户端抛出事件"WeixinJSBridgeReady"
//         if (document.addEventListener) {
//             document.addEventListener("WeixinJSBridgeReady", function(){
//                 document.getElementById('media').voice.load()
//                 document.getElementById('media').voice.play();
//             }, false);
//         } else if (document.attachEvent) {
//             document.attachEvent("WeixinJSBridgeReady", function(){
//                 document.getElementById('media').voice.load()
//                  document.getElementById('media').voice.play();
//             });
//             document.attachEvent("onWeixinJSBridgeReady", function(){
//                 document.getElementById('media').voice.load()
//                 document.getElementById('media').voice.play();
//             });
//         }
//     }
// })
