$(function () {
    const navContent = $("#nav_content");
    const carouselWrapper = $("#carouselWrapper");
    let currentPage = 0;
    let totalPages = 0;
    let navPages = [];

    function createNavLine() {
        let line = document.createElement("div");
        line.className = "nav-line";
        return line;
    }

    function createNavBlock(info) {
        let lines = []
        {
            for (let link of info.links) {
                lines.push(
                    `<li><a href="${link.href}" class="jj-list-link ${link._class}" target="_blank">${link.title}</a></li>`
                );
            }
        }
        return `<div class="jj-list">
                    <div class="jj-list-tit">${info.title}</div>
                    <ul class="jj-list-con">
                        ${lines.join("\n")}
                    </ul>
                </div>`
    }

    function createNavPage(groups) {
        const page = document.createElement("div");
        page.className = "nav-page";
        
        let num = 0;
        let line = createNavLine();
        for (let group of groups) {
            if (group.title) {
                line.innerHTML += createNavBlock(group)
            }
            if (++num % 3 === 0) {
                page.appendChild(line);
                line = createNavLine();
            }
        }
        if (num % 3 !== 0) { // 如果最后一行不满3个，也要添加
            page.appendChild(line);
        }
        
        return page;
    }

    function renderPagination() {
        const indicatorsContainer = $("#pageIndicators");
        indicatorsContainer.empty();
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = $(`<span class="page-indicator ${i === currentPage ? 'active' : ''}" data-page="${i}"></span>`);
            indicatorsContainer.append(indicator);
        }
        
        // 为指示器添加点击事件
        $(".page-indicator").on('click', function() {
            const pageNum = parseInt($(this).data('page'));
            goToPage(pageNum);
        });
    }

    function goToPage(pageNum) {
        if (pageNum < 0 || pageNum >= totalPages) return;
        
        currentPage = pageNum;
        const translateX = -currentPage * 100;
        navContent.css('transform', `translateX(${translateX}%)`);
        
        // 更新指示器样式
        $(".page-indicator").removeClass('active');
        $(`.page-indicator[data-page="${currentPage}"]`).addClass('active');
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }

    $.get("./static/data/bookmark.json", function (json) {
        if (json && json.code === 0 && json.data) {
            // 将数据分组，每6组为一页
            const itemsPerPage = 6; // 每页显示6个分组
            for (let i = 0; i < json.data.length; i += itemsPerPage) {
                const pageGroups = json.data.slice(i, i + itemsPerPage);
                const page = createNavPage(pageGroups);
                navPages.push(page);
            }
            
            totalPages = navPages.length;
            
            // 清空并添加所有页面
            navContent.empty();
            for (let page of navPages) {
                navContent.append(page);
            }
            
            // 创建分页指示器
            renderPagination();
            
            // 绑定按钮事件
            $("#nextPage").on('click', nextPage);
            $("#prevPage").on('click', prevPage);
        }
    })
})