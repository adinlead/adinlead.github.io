// 配置信息

// 地图API配置
const mapConfig = {
    key: '27c1097775ccb2d01d8f253beb6eecdf',
    center: '117.13101999,36.67169444',
    zoom: 16,
    height: 400
};

// 标记点配置
const markers = [
    {
        size: 'large',
        name: '签到签退点',
        location: '117.13101999,36.67169444',
        label: '鸽',
        color: '0x00FF99',
        poiName: '银荷珠润',
        poiHref: 'https://intel.ingress.com/?pll=36.671257,117.124893'
    },
    {
        size: 'large',
        name: '资源补给点',
        location: '117.13062232,36.67195001',
        label: '饭',
        color: '0x3399CC',
        poiName: '雨滴广场',
        poiHref: 'https://intel.ingress.com/?pll=36.671512,117.124495'
    }
];

// 任务类型
const MissionType = Object.freeze({
    SEQUENTIAL: Symbol("顺序"),
    ANY_ORDER: Symbol("无序"),
});

// 动作类型
const Objective = Object.freeze({
    hack_this_portal: Symbol("入侵"),
    install_a_mod_on_this_portal: Symbol("安装MOD"),
    capture_or_upgrade_portal: Symbol("占领或升级"),
    create_link_from_portal: Symbol("创建链接"),
    create_field_from_portal: Symbol("创建控制场"),
    enter_the_passphrase: Symbol("输入密码"),
});

// 任务模板
const missionTemplates = [
    {
        name: "请添加任务标题",
        description: "请添加任务说明",
        alert: "请添加任务提示",
        preview: "请添加任务预览图片",
        type: MissionType.SEQUENTIAL,
        waypoints: [
            {
                name: "POI NAME",
                iitcHref: "http://localhost:9081/",
                gameHref: "http://localhost:9081/",
                location: "116.481485,39.990464",
                objective: Objective.hack_this_portal,
                alert: ""
            }
        ]
    },
];

// 任务配置
const missions = [
    {
        name: "IngressFS Jinan February 2026 No.1",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_01.JPG",
        type: MissionType.SEQUENTIAL
    },
    {
        name: "IngressFS Jinan February 2026 No.2",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_02.JPG",
        type: MissionType.SEQUENTIAL
    },
    {
        name: "IngressFS Jinan February 2026 No.3",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_03.JPG",
        type: MissionType.SEQUENTIAL
    },
    {
        name: "IngressFS Jinan February 2026 No.4",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_04.jpg",
        type: MissionType.SEQUENTIAL
    },
    {
        name: "IngressFS Jinan February 2026 No.5",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_05.JPG",
        type: MissionType.SEQUENTIAL
    },
    {
        name: "IngressFS Jinan February 2026 No.6",
        description: "请添加任务说明",
        preview: "img/missions/MISSIONS_06.JPG",
        type: MissionType.SEQUENTIAL
    }
];

// 二维码配置
const qrCodeConfig = {
    wechat: {
        id: 'wechatQRCode',
        url: 'https://weixin.qq.com/g/AwYAABdrVj57z5W1vN-4Kx6XhQo'
    },
    telegram: {
        id: 'telegramQRCode',
        url: 'https://t.me/+VW2gBZ22zM6Ozbmp'
    },
    signup: {
        id: 'signupQRCode',
        url: 'https://fevgames.net/ifs/event/?e=28933'
    }
};

// Telegram频道配置
const telegramConfig = {
    url: qrCodeConfig.telegram.url,
    name: '加入Telegram频道'
};

// 活动报名配置
const signupConfig = {
    url: qrCodeConfig.signup.url,
    name: '活动报名链接'
};

// 活动联络人配置
const leaders = {
    res: [
        {
            nickname: 'AgennyBrof',
            contacts: [{
                title: '',
                account: '',
                link: '',
                qrLink: ''
            }]
        }
    ],
    enl: [
        {
            nickname: '伯杨（itez）',
            contacts: [{
                title: '微信',
                account: 'imbeyond',
                link: 'https://u.wechat.com/EKxpEyvPo1tFwa7df2cl__c?s=2',
                qrLink: 'https://u.wechat.com/EKxpEyvPo1tFwa7df2cl__c?s=2'
            }]
        }
    ]
};
