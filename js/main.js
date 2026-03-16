// 数据
        let covenantData = {};
        let operatorData = {};
        let currentCovenant = null;

        // 加载数据
        async function loadData() {
            try {
                const [covenantResponse, operatorResponse] = await Promise.all([
                    fetch('data/data_盟约.json'),
                    fetch('data/data_干员.json')
                ]);
                
                covenantData = await covenantResponse.json();
                operatorData = await operatorResponse.json();
                
                renderCovenantList();
            } catch (error) {
                console.error('加载数据失败:', error);
            }
        }

        // 渲染盟约列表
        function renderCovenantList() {
            const covenantList = document.getElementById('covenantList');
            covenantList.innerHTML = '';
            
            Object.keys(covenantData).forEach(covenantName => {
                const covenantItem = document.createElement('div');
                covenantItem.className = 'covenant-item';
                covenantItem.dataset.covenant = covenantName;
                
                const covenantIcon = document.createElement('img');
                covenantIcon.className = 'covenant-icon';
                covenantIcon.src = `images/盟约/${covenantName}.png`;
                covenantIcon.alt = covenantName;
                covenantIcon.onerror = function() {
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzJhNGE2ZSIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj4/PC90ZXh0Pgo8L3N2Zz4K';
                };
                
                const covenantNameEl = document.createElement('div');
                covenantNameEl.className = 'covenant-name';
                covenantNameEl.textContent = covenantName;
                
                covenantItem.appendChild(covenantIcon);
                covenantItem.appendChild(covenantNameEl);
                
                covenantItem.addEventListener('click', () => selectCovenant(covenantName));
                
                covenantList.appendChild(covenantItem);
            });
        }

        // 选择盟约
        function selectCovenant(covenantName) {
            // 清空搜索框并隐藏清除按钮
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            const clearBtn = document.getElementById('clearSearch');
            if (clearBtn) clearBtn.style.display = 'none';

            currentCovenant = covenantName;
            
            // 更新选中状态
            document.querySelectorAll('.covenant-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-covenant="${covenantName}"]`).classList.add('active');
            
            // 显示盟约信息
            showCovenantInfo(covenantName);
            
            // 显示相关干员
            showOperators(covenantName);
        }

        // 显示盟约信息
        function showCovenantInfo(covenantName) {
            const covenantInfo = document.getElementById('covenantInfo');
            const covenant = covenantData[covenantName];
            
            if (!covenant) {
                covenantInfo.innerHTML = '<div class="empty-state">盟约信息不存在</div>';
                return;
            }
            
            covenantInfo.innerHTML = `
                <h2>${covenantName}</h2>
                <div class="covenant-details">
                    <div class="requirement">激活需要人数: ${covenant['激活需要人数'] || '无'}</div>
                    <div class="description">${covenant['描述']}</div>
                </div>
            `;
        }

        // 显示相关干员
        function showOperators(covenantName) {
            const operatorsSection = document.getElementById('operatorsSection');
            const operators = [];
            
            // 找到属于该盟约的所有干员
            Object.keys(operatorData).forEach(operatorName => {
                const operator = operatorData[operatorName];
                if (operator['盟约'] && operator['盟约'].includes(covenantName)) {
                    operators.push({
                        name: operatorName,
                        tier: operator['阶位'],
                        covenants: operator['盟约'],
                        trait: operator['特质']
                    });
                }
            });
            
            if (operators.length === 0) {
                operatorsSection.innerHTML = `
                    <h3>干员列表</h3>
                    <div class="empty-state">没有找到属于该盟约的干员</div>
                `;
                return;
            }
            
            // 按阶位排序
            operators.sort((a, b) => {
                const tierOrder = {'6阶': 6, '5阶': 5, '4阶': 4, '3阶': 3, '2阶': 2, '1阶': 1};
                return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
            });
            
            operatorsSection.innerHTML = `
                <h3>干员列表</h3>
                <div class="operators-layout">
                    <div class="operators-list" id="operatorsList"></div>
                    <div class="operator-detail-panel" id="operatorDetailPanel">
                        <div class="empty-state">请点击左侧干员查看详细信息</div>
                    </div>
                </div>
            `;
            
            const operatorsList = document.getElementById('operatorsList');
            
            operators.forEach((operator, index) => {
                const operatorCard = document.createElement('div');
                operatorCard.className = 'operator-card';
                
                const avatar = document.createElement('img');
                avatar.className = 'operator-avatar';
                avatar.src = `images/干员/${operator.name}.png`;
                avatar.alt = operator.name;
                avatar.onerror = function() {
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM0YTRhZmYiLz4KPHRleHQgeD0iMzAiIHk9IjM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiI+PjwvdGV4dD4KPC9zdmc+';
                };
                
                const infoShort = document.createElement('div');
                infoShort.className = 'operator-info-short';
                
                const name = document.createElement('div');
                name.className = 'operator-name';
                name.textContent = operator.name;
                
                const tier = document.createElement('div');
                tier.className = 'operator-tier';
                tier.textContent = operator.tier;
                
                infoShort.appendChild(name);
                infoShort.appendChild(tier);
                
                operatorCard.appendChild(avatar);
                operatorCard.appendChild(infoShort);
                
                operatorCard.addEventListener('click', () => {
                    document.querySelectorAll('.operator-card').forEach(c => c.classList.remove('active'));
                    operatorCard.classList.add('active');
                    renderOperatorDetail(operator);
                });
                
                operatorsList.appendChild(operatorCard);

                // 默认选中第一个干员
                if (index === 0) {
                    operatorCard.classList.add('active');
                    renderOperatorDetail(operator);
                }
            });
        }

        // 在右侧面板渲染干员详情
        function renderOperatorDetail(operator) {
            const panel = document.getElementById('operatorDetailPanel');
            
            const covenantsHtml = operator.covenants.map(covenant => 
                `<span class="tooltip-tag" data-covenant="${covenant}">${covenant}</span>`
            ).join('');
            
            panel.innerHTML = `
                <div class="tooltip-header">
                    <img class="tooltip-avatar" src="images/干员/${operator.name}.png" alt="${operator.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM0YTRhZmYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiI+PjwvdGV4dD4KPC9zdmc+Cg==';">
                    <div class="tooltip-info">
                        <h4>${operator.name}</h4>
                        <div class="tooltip-tier">${operator.tier}</div>
                    </div>
                </div>
                
                <div class="tooltip-covenants">
                    <h5>所属盟约</h5>
                    <div class="tooltip-tags">
                        ${covenantsHtml}
                    </div>
                </div>
                
                <div class="tooltip-trait">
                    <h5>特质</h5>
                    <div class="tooltip-trait-desc">
                        <div class="tooltip-trait-category"> ${operator.trait['分类']}</div>
                        <div>${processTraitDesc(operator.trait['描述'])}</div>
                    </div>
                </div>
            `;
            
            // 添加盟约标签和特质关键词点击/悬浮事件
            setTimeout(() => {
                const covenantTags = panel.querySelectorAll('.tooltip-tag');
                covenantTags.forEach(tag => {
                    tag.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const covenantName = tag.dataset.covenant;
                        selectCovenant(covenantName);
                    });
                });

                const traitKeywords = panel.querySelectorAll('.trait-keyword');
                traitKeywords.forEach(kw => {
                    const format = kw.dataset.format || '<';
                    kw.addEventListener('mouseenter', (e) => showKeywordTooltip(kw.dataset.keyword, format, e, operator));
                    kw.addEventListener('mouseleave', () => hideKeywordTooltip());
                });
            }, 50);
        }

        // 处理特质描述，将关键词高亮
        function processTraitDesc(desc) {
            if (!desc) return '';
            const keywords = ['获得时', '进入休整期时', '休整期结束时', '售出时', '战斗开始时'];
            
            const keywordPattern = keywords.join('|');
            // 匹配 <关键词> 或 "关键词"
            const regex = new RegExp(`([<"])(${keywordPattern})([>"])`, 'g');
            
            return desc.replace(regex, '$1<span class="trait-keyword" data-keyword="$2" data-format="$1" style="color:#ff6b35; cursor:help; text-decoration:underline dashed; font-weight:bold;">$2</span>$3');
        }

        let keywordTooltipTimeout = null;
        let isMouseOverKeywordTooltip = false;

        // 显示特质关键词对应干员
        function showKeywordTooltip(keyword, format, event, sourceOperator) {
            isMouseOverKeywordTooltip = false;
            if (keywordTooltipTimeout) {
                clearTimeout(keywordTooltipTimeout);
                keywordTooltipTimeout = null;
            }

            const kt = document.getElementById('keywordTooltip');
            
            // 找到所有带有此关键词的干员
            const ops = [];
            Object.keys(operatorData).forEach(name => {
                // 如果是当前正在查看的本干员，则跳过不显示在提示框中
                if (sourceOperator && name === sourceOperator.name) return;

                const op = operatorData[name];
                let hasType1 = false;
                let hasType2 = false;
                
                if (op['特质']) {
                    if (op['特质']['tag'] && op['特质']['tag'].includes(keyword)) {
                        hasType1 = true;
                    }
                    if (op['特质']['描述']) {
                        if (op['特质']['描述'].includes(`<${keyword}>`)) hasType1 = true;
                        if (op['特质']['描述'].includes(`"${keyword}"`)) hasType2 = true;
                    }
                }
                
                if (hasType1 || hasType2) {
                    let isPreferred = false;
                    // 如果悬停在尖括号(<)格式，优先显示带双引号(")格式的干员，反之亦然，说明它们互相联动
                    if (format === '<' && hasType2) isPreferred = true;
                    if (format === '"' && hasType1) isPreferred = true;

                    ops.push({ 
                        name, 
                        desc: op['特质']['描述'],
                        covenants: op['盟约'] || [],
                        tier: op['阶位'] || '1阶',
                        isPreferred
                    });
                }
            });
            
            if (ops.length === 0) {
                kt.innerHTML = `<h4>未找到带有【${keyword}】效果的干员</h4>`;
            } else {
                // 排序逻辑：优先匹配联动格式的干员 > 同盟约的干员 > 阶位高低
                const sourceCovenants = sourceOperator ? sourceOperator.covenants : [];
                ops.sort((a, b) => {
                    // 1. 优先带有互相联动格式的（例如: 当前源词为尖括号，优先含有双引号标签的）
                    if (a.isPreferred !== b.isPreferred) {
                        return a.isPreferred ? -1 : 1;
                    }

                    // 2. 属于同一个阵营优先
                    const aShare = a.covenants.some(c => sourceCovenants.includes(c)) ? 1 : 0;
                    const bShare = b.covenants.some(c => sourceCovenants.includes(c)) ? 1 : 0;
                    if (aShare !== bShare) return bShare - aShare;
                    
                    // 3. 按阶位高低排序
                    const tierOrder = {'6阶': 6, '5阶': 5, '4阶': 4, '3阶': 3, '2阶': 2, '1阶': 1};
                    return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
                });

                let html = `<h4>【${keyword}】相关干员</h4>`;
                ops.forEach(op => {
                    const covenantsHtml = op.covenants.map(c => 
                        `<span class="keyword-op-covenant-tag">${c}</span>`
                    ).join('');

                    html += `
                        <div class="keyword-op-item">
                            <img src="images/干员/${op.name}.png" class="keyword-op-avatar" alt="${op.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM0YTRhZmYiLz4KPHRleHQgeD0iMzAiIHk9IjM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiI+PjwvdGV4dD4KPC9zdmc+';">
                            <div class="keyword-op-content">
                                <div class="keyword-op-header">
                                    <div class="keyword-op-name">${op.name}</div>
                                    <div class="keyword-op-covenants">${covenantsHtml}</div>
                                </div>
                                <div class="keyword-op-desc">${op.desc}</div>
                            </div>
                        </div>
                    `;
                });
                kt.innerHTML = html;
            }
            
            // 计算位置
            const rect = event.target.getBoundingClientRect();
            
            kt.classList.add('show');
            const ktRect = kt.getBoundingClientRect();
            kt.classList.remove('show');
            
            // 默认显示在关键词的右侧
            let left = rect.right + 15;
            let top = rect.top - pktRectHeightAdjustment(ktRect.height, rect.height);
            
            function pktRectHeightAdjustment(h, rh) { return (h / 2) - (rh / 2); }
            
            // 如果右侧空间不足以显示 tooltip，则显示在左侧
            if (left + ktRect.width > window.innerWidth - 20) {
                left = rect.left - ktRect.width - 15;
            }
            
            // 再次水平边界检查，极端情况下如果两边都放不下
            if (left < 10) left = 10;
            if (left + ktRect.width > window.innerWidth - 10) left = window.innerWidth - ktRect.width - 10;
            
            // 垂直边界检查：如果超出屏幕上下
            if (top < 10) top = 10;
            if (top + ktRect.height > window.innerHeight - 10) {
                top = window.innerHeight - ktRect.height - 10;
                if (top < 10) top = 10; // 保证不在可视区上方剪裁
            }
            
            kt.style.left = left + 'px';
            kt.style.top = top + 'px';
            
            requestAnimationFrame(() => kt.classList.add('show'));
        }

        function hideKeywordTooltip() {
            if (isMouseOverKeywordTooltip) {
                return;
            }
            
            keywordTooltipTimeout = setTimeout(() => {
                if (!isMouseOverKeywordTooltip) {
                    document.getElementById('keywordTooltip').classList.remove('show');
                }
                keywordTooltipTimeout = null;
            }, 100);
        }

        // 给关键词悬浮框添加鼠标事件
        document.addEventListener('DOMContentLoaded', () => {
            const kt = document.getElementById('keywordTooltip');
            
            kt.addEventListener('mouseenter', () => {
                isMouseOverKeywordTooltip = true;
                if (keywordTooltipTimeout) {
                    clearTimeout(keywordTooltipTimeout);
                    keywordTooltipTimeout = null;
                }
            });
            
            kt.addEventListener('mouseleave', () => {
                isMouseOverKeywordTooltip = false;
                hideKeywordTooltip();
            });
        });

        // 初始化
        loadData();
    
        
        
        
        
        // 搜索相关功能
        function handleSearch(event) {
            const query = event.target.value.trim().toLowerCase();
            const clearBtn = document.getElementById('clearSearch');

            if (query.length > 0) {
                clearBtn.style.display = 'block';
                // 取消盟约的高亮选择
                document.querySelectorAll('.covenant-item').forEach(item => {
                    item.classList.remove('active');
                });
                currentCovenant = null;
                searchOperators(query);
            } else {
                clearBtn.style.display = 'none';
                const covenantInfo = document.getElementById('covenantInfo');
                covenantInfo.innerHTML = '<div class="empty-state">请选择一个盟约或搜索干员查看详细信息</div>';
                const operatorsSection = document.getElementById('operatorsSection');
                operatorsSection.innerHTML = '<h3>干员列表</h3><div class="empty-state">请选择一个盟约或搜索干员查看相关干员</div>';
            }
        }

        function clearSearch() {
            const input = document.getElementById('searchInput');
            input.value = '';
            handleSearch({ target: input });
        }

        function searchOperators(query) {
            const operatorsSection = document.getElementById('operatorsSection');
            const covenantInfo = document.getElementById('covenantInfo');

            const operators = [];

            // 搜索所有干员
            Object.keys(operatorData).forEach(operatorName => {
                const operator = operatorData[operatorName];
                const searchStr = (operatorName + (operator['特质']?operator['特质']['描述']:'') + (operator['盟约']?operator['盟约'].join(','):'')).toLowerCase();
                if (searchStr.includes(query)) {
                    operators.push({
                        name: operatorName,
                        tier: operator['阶位'],
                        covenants: operator['盟约'] || [],
                        trait: operator['特质']
                    });
                }
            });

            // 更新上方信息面板为搜索总结
            covenantInfo.innerHTML = `
                <h2>🔍 搜索结果</h2>
                <div class="covenant-details">
                    <div class="requirement">包含关键字: "<b>${query}</b>"</div>
                    <div class="description">共找到 ${operators.length} 名符合条件的干员。</div>
                </div>
            `;

            if (operators.length === 0) {
                operatorsSection.innerHTML = `
                    <h3>搜索结果</h3>
                    <div class="empty-state">没有找到匹配的干员</div>
                `;
                return;
            }

            // 按阶位排序
            operators.sort((a, b) => {
                const tierOrder = {'6阶': 6, '5阶': 5, '4阶': 4, '3阶': 3, '2阶': 2, '1阶': 1};
                return (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
            });

            operatorsSection.innerHTML = `
                <h3>搜索结果</h3>
                <div class="operators-layout">
                    <div class="operators-list" id="operatorsList"></div>
                    <div class="operator-detail-panel" id="operatorDetailPanel">
                        <div class="empty-state">点击左侧干员查看详细信息</div>
                    </div>
                </div>
            `;

            const listContainer = document.getElementById('operatorsList');

            operators.forEach((op, index) => {
                const card = document.createElement('div');
                card.className = 'operator-card';
                if (index === 0) card.classList.add('active');

                card.innerHTML = `
                    <img src="images/干员/${op.name}.png" class="operator-avatar" alt="${op.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM0YTRhZmYiLz4KPHRleHQgeD0iMzAiIHk9IjM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiI+PjwvdGV4dD4KPC9zdmc+';">
                    <div class="operator-info-short">
                        <div class="operator-name">${op.name}</div>
                        <div class="operator-tier">${op.tier}</div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    document.querySelectorAll('.operator-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    
                    // The user wants clicking a searched operator to jump to that operator's covenant.
                    // If the operator has a covenant, select the first one.
                    if (op.covenants && op.covenants.length > 0) {
                        const targetCovenantName = op.covenants[0];
                        // Select the covenant on the left
                        const covenantItems = document.querySelectorAll('.covenant-item');
                        covenantItems.forEach(item => {
                            if (item.dataset.covenant === targetCovenantName) {
                                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                        
                        // Select the covenant logic
                        selectCovenant(targetCovenantName);
                        
                        // Find the operator card inside the newly rendered operator list and click it
                        setTimeout(() => {
                           const newOpCards = document.querySelectorAll('#operatorsList .operator-card');
                           for (let c of newOpCards) {
                               if (c.querySelector('.operator-name').textContent === op.name) {
                                   c.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                   c.click();
                                   break;
                               }
                           }
                        }, 0);
                        
                    } else {
                        renderOperatorDetail(op);
                    }
                });

                listContainer.appendChild(card);
            });

            if(operators.length > 0) {
                // DON'T select immediately to jump the view unless desired. But by default it's fine.
                // Or maybe just render the first one's detail in the search panel.
                renderOperatorDetail(operators[0]);
            }
        }