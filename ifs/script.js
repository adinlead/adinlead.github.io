// 全局初始化
document.initEvents = [];

// 功能代码

// 地图相关功能
document.initEvents.push(function () {
    const eventPois = document.getElementById('eventPois');
    // 构建POI HTML
    eventPois.innerHTML = null;
    markers.forEach(marker => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${marker.name}：</strong><a href="${marker.poiHref}" target="_blank">${marker.poiName}</a>`;
        eventPois.appendChild(p);
    });
});

// 构建静态地图URL
function buildMapUrl() {
    var container = document.getElementById('mapContainer');
    var width = container.offsetWidth;

    // 构建标记点参数
    var markersParam = markers.map(function (marker, index) {
        return `${marker.size},${marker.color},${marker.label}:${marker.location}`;
    }).join('|');

    // 构建完整URL
    var url = 'https://restapi.amap.com/v3/staticmap?' +
        'key=' + mapConfig.key + '&' +
        'location=' + mapConfig.center + '&' +
        'zoom=' + mapConfig.zoom + '&' +
        'size=' + width + '*' + mapConfig.height + '&' +
        'markers=' + markersParam;
    return url;
}

// 更新地图
function updateMap() {
    var img = document.getElementById('staticMap');
    img.src = buildMapUrl();
}

// 初始化地图
updateMap();

// 监听窗口大小变化
var resizeObserver = new ResizeObserver(function (entries) {
    for (var entry of entries) {
        updateMap();
        break;
    }
});

// 观察地图容器
var mapContainer = document.getElementById('mapContainer');
resizeObserver.observe(mapContainer);

// 任务相关功能
// 渲染任务图
document.initEvents.push(function () {
    const grid = document.getElementById('missionsGrid');

    missions.forEach((mission, index) => {
        const item = document.createElement('div');
        item.className = 'mission-item';
        item.innerHTML = `
            <div class="mission-image-container">
                <img src="${mission.preview}" alt="${mission.name}">
            </div>
            <div class="mission-name">${mission.name}</div>
        `;
        item.onclick = () => showMissionModal(index);
        grid.appendChild(item);
    });
});

// 显示任务模态框
function showMissionModal(index) {
    // 先关闭旧窗口
    closeMissionModal();
    
    const mission = missions[index];
    const modal = document.createElement('div');
    modal.className = 'mission-modal active';
    modal.id = 'missionModal';
    modal.onclick = (e) => {
        if (e.target === modal) closeMissionModal();
    };
    
    // 定义键盘事件处理函数
    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            // 左箭头翻到上一个任务
            const prevIndex = (index - 1 + missions.length) % missions.length;
            showMissionModal(prevIndex);
        } else if (e.key === 'ArrowRight') {
            // 右箭头翻到下一个任务
            const nextIndex = (index + 1) % missions.length;
            showMissionModal(nextIndex);
        } else if (e.key === 'Escape') {
            // ESC键关闭窗口
            closeMissionModal();
        }
    }
    
    // 保存事件处理函数引用
    window.currentKeyPressHandler = handleKeyPress;
    
    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyPress);
    
    // 检查导航点和坐标信息
    const hasWaypoints = mission.waypoints && mission.waypoints.length > 0;
    const hasCoordinates = hasWaypoints && mission.waypoints.some(wp => wp.location);
    
    // 计算中心点
    function calculateCenter(waypoints) {
        let sumLat = 0, sumLng = 0;
        waypoints.forEach(wp => {
            if (wp.location) {
                const [lng, lat] = wp.location.split(',').map(Number);
                sumLat += lat;
                sumLng += lng;
            } else {
                // 默认值
                sumLat += 36.67169444;
                sumLng += 117.13101999;
            }
        });
        return {
            lat: sumLat / waypoints.length,
            lng: sumLng / waypoints.length
        };
    }
    
    // 构建翻页按钮
    const prevButton = index > 0 ? `<button class="modal-nav-btn modal-nav-btn-prev" onclick="showMissionModal(${index - 1})">&lt;</button>` : '';
    const nextButton = index < missions.length - 1 ? `<button class="modal-nav-btn modal-nav-btn-next" onclick="showMissionModal(${index + 1})">&gt;</button>` : '';
    
    // 构建地图URL的辅助函数
    function calculateMapUrl() {
        if (!hasWaypoints || !hasCoordinates) return '';
        
        const center = calculateCenter(mission.waypoints);
        
        // 构建标记点参数
        let markersParam = '';
        mission.waypoints.forEach((wp, i) => {
            if (wp.location) {
                markersParam += `mid,,${String.fromCharCode(65 + i)}:${wp.location}|`;
            }
        });
        markersParam = markersParam.slice(0, -1); // 移除最后的|
        
        // 构建路径参数（顺序任务）
        let pathParam = '';
        if (mission.type === MissionType.SEQUENTIAL && mission.waypoints.length > 1) {
            const pathLocations = mission.waypoints.map(wp => wp.location).join('|');
            pathParam = `&path=0xFF0000,4,1,0:${pathLocations}`;
        }
        
        // 构建地图URL
        return `https://restapi.amap.com/v3/staticmap?key=27c1097775ccb2d01d8f253beb6eecdf&location=${center.lng},${center.lat}&zoom=17&size=350*350&markers=${markersParam}${pathParam}`;
    }
    
    // 统一弹窗结构 - 网格布局
    let modalContent = `
        <span class="modal-close" onclick="closeMissionModal()">&times;</span>
        ${prevButton}
        ${nextButton}
        <div class="modal-content">
            <div class="modal-grid">
                <!-- 第一行左侧：任务信息区 -->
                <div class="modal-info-section">
                    <h3>${mission.name} <span class="mission-type">(${mission.type.description})</span></h3>
                    ${mission.description ? `<p>${mission.description}</p>` : ''}
                    ${mission.alert ? `<div class="waypoint-alert">${mission.alert}</div>` : ''}
                </div>
                
                <!-- 第一行右侧：任务预览图片 -->
                <div class="modal-preview-section">
                    <img src="${mission.preview}" alt="任务预览">
                </div>
                
                <!-- 第二行左侧：导航点列表 -->
                ${hasWaypoints ? `
                    <div class="modal-waypoints-section">
                        <h4>导航点</h4>
                        <ul class="waypoint-list">
                            ${mission.waypoints.map((wp, i) => `
                                <li class="waypoint-item">
                                    <h4>
                                        ${i + 1}. ${wp.name}
                                        ${(wp.iitcHref || wp.gameHref) ? `<span class="waypoint-links">
                                            ${wp.iitcHref ? `<a href="${wp.iitcHref}" target="_blank">IITC</a>` : ''}
                                            ${wp.gameHref ? `<a href="${wp.gameHref}" target="_blank">游戏</a>` : ''}
                                        </span>` : ''}
                                    </h4>
                                    ${wp.objective ? `<p><strong>动作：</strong>${wp.objective.description}</p>` : ''}
                                    ${wp.alert ? `<div class="waypoint-alert">${wp.alert}</div>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- 第二行右侧：地图 -->
                ${hasWaypoints && hasCoordinates ? `
                    <div class="modal-map-section">
                        <img src="${calculateMapUrl()}" alt="任务地图">
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// 关闭任务模态框
function closeMissionModal() {
    const modal = document.getElementById('missionModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        // 移除键盘事件监听器
        if (window.currentKeyPressHandler) {
            document.removeEventListener('keydown', window.currentKeyPressHandler);
            window.currentKeyPressHandler = null;
        }
    }
}

// 二维码相关功能
// 生成二维码的通用方法
function generateQRCode(containerId, qrCodeContent) {
    // 获取容器
    const container = document.getElementById(containerId);
    
    if (container) {
        // 生成二维码
        QRCode.toCanvas(container, qrCodeContent, {
            width: 150,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) console.error(error);
        });
    }
}

// 初始化二维码
document.initEvents.push(function () {
    // 生成微信二维码
    generateQRCode('wechatQRCode', qrCodeConfig.wechat.url);
    // 生成Telegram二维码
    generateQRCode('telegramQRCode', qrCodeConfig.telegram.url);
    // 生成活动报名二维码
    generateQRCode('signupQRCode', qrCodeConfig.signup.url);
});

// 渲染活动联络人
document.initEvents.push(function () {
    const groupsSection = document.getElementById('groups');
    const groupsContainer = groupsSection.querySelector('.groups');
    
    // 生成随机数，实现彩蛋效果
    const randomNumber = Math.floor(Math.random() * 100);
    const isOdd = randomNumber % 2 === 1;
    
    // 渲染负责人
    function renderLeaders(faction) {
        let html = '';
        const leadersList = leaders[faction];
        const textClass = faction === 'res' ? 'res-text' : 'enl-text';
        
        if (leadersList && leadersList.length > 0) {
            leadersList.forEach(leader => {
                html += `<div class="leader-item">
                    <h4 class="${textClass}">${leader.nickname}</h4>
                `;
                
                if (leader.contacts && leader.contacts.length > 0) {
                    leader.contacts.forEach(contact => {
                        html += `<div class="contact-item">
                            <p><strong>${contact.title}：</strong>`;
                            
                            if (contact.link) {
                                html += `<a href="${contact.link}" target="_blank">${contact.account}</a>`;
                            } else {
                                html += contact.account;
                            }
                            
                            html += `</p>`;
                            
                            if (contact.qrLink) {
                                const qrId = `qr-${leader.nickname}-${contact.title}`;
                                html += `<canvas id="${qrId}" class="qrcode small"></canvas>`;
                                // 生成二维码
                                setTimeout(() => {
                                    generateQRCode(qrId, contact.qrLink);
                                }, 0);
                            }
                            
                            html += `</div>`;
                        });
                }
                
                html += `</div>`;
            });
        }
        return html;
    }
    
    // 找到活动联络人元素
    const leaderItem1 = document.getElementById('leaderItem1');
    const leaderItem2 = document.getElementById('leaderItem2');
    
    if (leaderItem1 && leaderItem2) {
        // 根据随机数决定显示顺序
        if (isOdd) {
            // 奇数：第一列显示ENL，第二列显示RES
            leaderItem1.innerHTML = '<h3>ENL联络人</h3>' + renderLeaders('enl');
            leaderItem2.innerHTML = '<h3>RES联络人</h3>' + renderLeaders('res');
        } else {
            // 偶数：第一列显示RES，第二列显示ENL
            leaderItem1.innerHTML = '<h3>RES联络人</h3>' + renderLeaders('res');
            leaderItem2.innerHTML = '<h3>ENL联络人</h3>' + renderLeaders('enl');
        }
    }
    
    // 更新Telegram和活动报名链接
    const telegramItem = groupsContainer.querySelectorAll('.group-item')[3];
    if (telegramItem) {
        const telegramLink = telegramItem.querySelector('a');
        if (telegramLink) {
            telegramLink.href = telegramConfig.url;
            telegramLink.textContent = telegramConfig.name;
        }
    }
    
    const signupItem = groupsContainer.querySelectorAll('.group-item')[4];
    if (signupItem) {
        const signupLink = signupItem.querySelector('a');
        if (signupLink) {
            signupLink.href = signupConfig.url;
            signupLink.textContent = signupConfig.name;
        }
    }
});

// 页面加载完成后执行所有初始化事件
document.addEventListener('DOMContentLoaded', function () {
    document.initEvents.forEach(function (event) {
        event();
    });
});
