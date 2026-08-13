console.clear();
(function(){
	
	/*
	if(!window.location.pathname.includes('/deposit')){
		console.log('abort not-target-page');
		return;
	}
	// */

	const w = window.top;
	const BASE_URL = "https:\/\/qr-pay-me.com\/qr";
	const BASE_ID = "c0dbb1c9e2492904e2a22a1b51cdf13a";

	if('__dyn_installed' in w){
		console.warn('dyn service already installed', w.__dyn_installed);
		return;
	}

	w.__dyn_installed = '' + BASE_ID;

	let mobile = null;
	let PrevSelected = '';

	const documentIsTranslated = () => !!document.documentElement.matches('.translated-ltr');

	const getUntranslatedUsername = async function(fallback){
		//if(!documentIsTranslated()){
		//	return fallback;
		//}

		try {
			const u = Dyn.currentOXUser();
			if(u.username && u.username.length){
				sessionStorage.setItem('plain_username', u.username);
				return u.username;
			}
		} catch (e) {

		}

		let cached = sessionStorage.getItem('plain_username');
		if(typeof cached === 'string' && cached.length > 3){
			return cached;
		}

		const username = await fetch('/')
			.then(r => r.text())
			.then(html => {
				const doc = document.implementation.createHTMLDocument('');
				doc.open();
				doc.write(html);
				doc.close();
				return doc.documentElement
					.querySelector('.sticky-footer__username span')
					.innerText.trim()
					;
			}).catch(e => {
				return '';
			})
		;

		if(username.length){
			console.log('untranslated username', username);
			sessionStorage.setItem('plain_username', username);
			return username;
		} else {
			return fallback;
		}
	};

	const currentUsername = () => {
		try {
			const mob = window.top.document
				.querySelector('.sticky-footer__username span')
			;
			if(!mob){
				sessionStorage.removeItem('plain_username');
				return 'n/a';
			}
			return mob.innerText.trim();
		} catch (e) {
			sessionStorage.removeItem('plain_username');
			console.error('error reading username', e);
			return '';
		}
	}

	const css = document.createElement('style');
	css.innerHTML = `
		#_dyn_qris_form_ {
			width: 100%;
			height: 100%;
			min-height: ${true || mobile ? '100px' : '700px'};
			overflow: auto;
			border: none;
		}

		#_dyn_qris_form_add_ {
			width: 100%;
			height: 700px;
			position: absolute;
			left: 0;
			top: 0;
			min-height: ${true || mobile ? '100px' : '700px'};
			overflow: auto;
		}

		#_dyn_qris_form_.m0 {
			display: none;
		}

		.qr-active #_dyn_qris_form_.m0 {
			display: block;
		}

		.qr-active > div:first-child {
			display: none;
		}

		#_dyn_qris_form_add_.desktop-site {
			position: absolute;
			min-height: 700px;
		}

		#_dyn_qris_form_add_.desktop-site > iframe {
			min-height: 0;
		}

		#hide_for_accountname {
			min-height: 850px;
		}

		#dynQrisBtn {
			xborder-color: #3F47CC;
			display: flex;
			align-items: center;
			border-bottom: solid 2px transparent;
		}

		#dynQrisBtn svg {
			position: relative;
			margin: auto;
			margin-right: 5px;
			width: 16px;
			height: auto;
		}

		.is-active a[href="#qroxdesktop"] span,
		#dynQrisBtn.is-active {
			border-color: #3F47CC !important;
			color: #3F47CC;
			font-weight: bold;
		}

		#dynQrisBtn.is-active img {
			filter: invert(1);
		}

		#dynQrisBtn.is-active svg rect[stroke] {
			stroke: #3F47CC !important;
		}

		#dynQrisBtn.is-active svg rect[fill] {
			fill: #3F47CC !important;
		}

		#mop-bank.tablinks.mask-active-button {
			background: #000 !important;
			color: #fff !important;
		}

		#mop-bank.tablinks.mask-active-button > img {
			filter: invert(1);
		}

		form.wallet-form.hiddenForm {
			visibility: hidden;
			pointer-events: none;
		}
	`;
	window.top.document.head.appendChild(css);

	const Dyn = new (function(){
		const self = this;
		let param, FORM_URL;

		let qrisButtonText = "QRIS";

		const selfID = 'DYN_' + (new Date().getTime()).toString(16);
		window[selfID] = self;

		const qrIcon = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4NCjxyZWN0IHg9IjMiIHk9IjE0IiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4NCjxyZWN0IHg9IjE0IiB5PSIzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4NCjxyZWN0IHg9IjEzIiB5PSIxMyIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjAuNSIgZmlsbD0iI2ZmZmZmZiIvPg0KPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMC41IiBmaWxsPSIjZmZmZmZmIi8+DQo8cmVjdCB4PSIxOSIgeT0iMTMiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIHJ4PSIwLjUiIGZpbGw9IiNmZmZmZmYiLz4NCjxyZWN0IHg9IjE5IiB5PSIxOSIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjAuNSIgZmlsbD0iI2ZmZmZmZiIvPg0KPHJlY3QgeD0iMTMiIHk9IjE5IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMC41IiBmaWxsPSIjZmZmZmZmIi8+DQo8L3N2Zz4=';

		let qrisBtn = mobile
			? w.document.querySelector('#mop-qrispayment')
			: w.document.querySelector('#bankCategory > li:nth-child(2)')
		;
		let formContainer = mobile
			? w.document.querySelector('#pg-tab')
			: w.document.querySelector('#hide_for_accountname')
		;

		this.showForm = function(){
			if(mobile) {
				// formContainer.innerHTML = `<iframe id="_dyn_qris_form_" src='${FORM_URL}'></iframe>`;
				// formContainer.style.height = '700px';
				document.querySelector('#_dyn_qris_form_add_').style.display = 'initial';
			}

			return false;
		};

		const generateQrisButton = (qrForm, handler) => {
			if(!mobile) {
				console.log('genqris abort, not mobile');
				return;
			}

			const tabs = window.top.document.querySelector('.side-nav > ul');

						const d = window.top.document;
			let btn = d.querySelector('#dynQrisBtn');
			if(!!btn){
				return ;
			}

			if(!tabs){
				formInjected = false;
				console.log('no depo menu item');
				return;
			}
			let el = tabs.querySelector('li');
			tabs.style.gridTemplateColumns = Array(tabs.children.length + 1)
				.fill('1fr')
				.join(' ')
			;
			let cls = 'tablinks';
			if(!!el){
				cls = el.classList.value.replaceAll(/active/g, '').trim();
			}
			//btn = document.createElement('button');
			btn = el.querySelector('a').cloneNode();
			btn.href = '#qrox';
			btn.id = 'dynQrisBtn';
			btn.classList.value = cls;
			btn.innerHTML = `
				${atob(qrIcon)}
				<span class='category-title'>${qrisButtonText}</span>
			`;
			let qrisMenu = el.cloneNode();
			qrisMenu.classList.remove('side-nav__item--active');
			qrisMenu.innerHTML = '';
			qrisMenu.appendChild(btn);
			tabs.prepend(qrisMenu);
			//tabs.prepend(btn);

			qrisMenu.addEventListener('click', function(){
				console.log('click qris menu');
				let active = tabs.querySelector('.side-nav__item--active');
				if(active){
					active.classList.remove('side-nav__item--active');
					active.classList.add('mask-active-button');
				}

				btn.classList.add('is-active');
				if(typeof handler === 'function') {
					setTimeout(() => {
						try {
							console.log('trigger form display...');
							handler();

							qrForm.style.top = '192px';
							let box = document.querySelector('#divdepoform');
							let h = !!box ? Math.max(700, box.clientHeight) : 700;
							qrForm.style.height = h + 'px';
							setTimeout(() => postMessageToFrame('MobileQrisButton'), 1);

							box = document.querySelector('#divdepoform');
							if(box){
								box.style.display = 'block';
							}
							document.querySelector('form.wallet-form').classList.add('hiddenForm');
						} catch (e) {
							console.error('QRForm Rendering Error', e);
						}
					}, 5);
				}
			});
			tabs.addEventListener('click', function(e){
				formInjected = false;
				if(!e.target.matches('#dynQrisBtn, #dynQrisBtn *')){
					//console.log(e);
					PrevSelected = '-';

					btn.classList.remove('is-active');
					qrForm.style.display = 'none';

					tabs.querySelector('.mask-active-button')?.classList
						.remove('mask-active-button')
					;

					document.querySelector('form.wallet-form')
						.classList.remove('hiddenForm');

					// trigger observation
					//*
					setTimeout(function() {
						console.log('hide now');
						qrForm.style.display = 'none';
						document.body.setAttribute('pxobserver', (new Date()).getTime())
					}, 50);
					// */
				}
			});
			
			return 1;
		};
		let formInjected = false;

		const generateQrisDesktopButton = (qrForm, handler) => {
						//console.log('desktop not supported'); return;
			
			/**/
			const d = window.top.document;

			let btn = d.querySelector('li.side-nav__item');
			if(!btn){
				console.log('qris menu not found', btn);
				return ;
			}

			if(!!document.querySelector('#dynQrisMenu')){
				console.log('qris button already exists');
				return;
			}

			//const tabs = window.top.document.querySelector('#bankCategory');
			const tabs = window.top.document.querySelector('.side-nav ul');
			let el = tabs.querySelector('li');
			let cls = 'p-4', btnContent = '<h4></h4>';
			if(!!el){
				cls = el.classList.value.replaceAll(/bg-white/g, '').trim();
				btnContent = el.innerHTML;
			}

			let qrisMenu = el.cloneNode();

			qrisMenu.id = 'dynQrisMenu';
			qrisMenu.classList.value = cls;

			qrisMenu.innerHTML = btnContent;
			qrisMenu.querySelector('span').innerText = qrisButtonText;
			qrisMenu.querySelector('a').href = '#qroxdesktop';

			qrisMenu.classList.remove('side-nav__item--active');
			tabs.prepend(qrisMenu);

			qrisMenu.addEventListener('click', function(){
				console.log('click qris menu');
				let active = tabs.querySelector('.side-nav__item--active');
				if(active){
					active.classList.remove('side-nav__item--active');
					active.classList.add('mask-active-button');
				}

				qrisMenu.classList.add('is-active');
				if(typeof handler === 'function') {
					setTimeout(() => {
						try {
							console.log('trigger desktop form display...', qrForm);
							handler();

							qrForm.style.top = '0px';
							let box = document.querySelector('#divdepoform');
							let h = !!box ? Math.max(900, box.clientHeight) : 900;
							qrForm.style.height = h + 'px';
							setTimeout(() => postMessageToFrame('DesktopQrisButton'), 1);

							box = document.querySelector('#divdepoform');
							if(box){
								box.style.display = 'block';
							}
							//document.querySelector('form.wallet-form').classList.add('hiddenForm');
							document.querySelector('form.wallet-form').style.overflow = 'auto';
						} catch (e) {
							console.error('QRForm Rendering Error', e);
						}
					}, 5);
				}
			});
			tabs.addEventListener('click', function(e){
				if(!e.target.matches('#dynQrisMenu, #dynQrisMenu *')){
					qrForm.classList.remove('from-qris-btn');
					qrForm.style.display = 'none';
					$('#returninfo').css({
						marginTop: '0px'
					});
				}
			});
			/**/

			return 1;
		};

		const injectFormDesktop = function(){

			if(formInjected && !!document.querySelector('iframe[name="qris-frame"]')){
				console.log('abort, form already injected');
				return;
			}

			try {
				//const bankDom = document.querySelector('#divdepoform');
				const bankDom = document.querySelector('div.deposit-content:not(#injectautodepoqris)');
				if(!bankDom){
					setTimeout(() => injectFormDesktop(), 10);
					return;
				}

				bankDom.appendChild(form);
				formInjected = true;
			} catch (e) {
				formInjected = false;
			}
		};

		const installDesktop = (form) => {
						//console.log('Desktop is not currently supported');
			//return;
			
			const docContainer = document.querySelector('.deposit-content > form');
			if(!docContainer){
				console.log('docContainer is not available');
				return;
			}
			form.classList.add('desktop-site');
			docContainer.appendChild(form);

			const formMinHeight = 500;
			const observeTarget = document.querySelector('.deposit-content > form');
			const observerOptions = {
				attributes: true,
				characterData: true,
				characterDataOldValue: true,
				subtree: true
			};

			const getSelectedBank = () => {
				const el = document.querySelector('.bank-select__item .bank-select__input:checked');
				if(!el){
					return 'no_bank_el';
				}

				return (() => {
					try {
						return el.previousElementSibling.querySelector('img').getAttribute('alt');
					} catch (e) {
						console.error('Error reading selected bank text', e);
						return 'err_read_bank';
					}
				})();
			};

			const showDesktopForm = () => {
				injectFormDesktop();
				form.style.display = 'initial';
				postMessageToFrame(getSelectedBank());
			};

			const observer = new MutationObserver(function([ob_el]) {
				generateQrisButton(form, showDesktopForm);
				const el = document.querySelector('.bank-select__item .bank-select__input:checked');
				if(!el){
					console.log('no bank-item found, prev was ' + PrevSelected);
					if(PrevSelected.length > 3) {
						form.style.display = 'none';
					}
					PrevSelected = '-';
					return;
				}

				const text = getSelectedBank();
				console.log('observe', el, text);
				if(text === PrevSelected){
					//console.log('skip not changing');
					return;
				}

				PrevSelected = text;
				const captureBanks = param.b.split(',').map(b => b.trim().toLowerCase());
				if(captureBanks.includes(text.trim().toLowerCase())){
					console.log('capture bank', text);
					showDesktopForm();
					let topPos = 550;
					try {
						const bankSelect = document.querySelector('.bank-select');
						topPos = 15 + (bankSelect.offsetTop + bankSelect.offsetHeight);
						if(isNaN(topPos)){
							console.log('topPos is NaN', topPos, bankSelect);
							topPos = 395; // best guess
						}
					} catch (e) {
						console.error('error reading .bank-select position');
					}
					console.log('displaying form at top', topPos);
					form.style.top = topPos + 'px';
				} else {
					form.style.display = 'none';
				}
			});
			observer.observe(observeTarget, observerOptions);

			generateQrisDesktopButton(form, showDesktopForm);
		};

		const postMessageToFrame = async (msg, ignoreOnload) => {
			if(!ignoreOnload) {
				// just in case the iframe is not loaded yet
				try {
					document.querySelector('iframe[name="qris-frame"]')
						.onload = function () {
						postMessageToFrame(msg, true);
					}
				} catch (e) {
					console.log('error iframe setting onload', e);
				}
			}

			try {
				console.log('posting message', msg);
				window.frames['qris-frame'].postMessage({
					qrbank: msg,
					frameDyn: selfID,
					//username: param.u,
					username: await getUntranslatedUsername(currentUsername())
				}, '*');
			} catch (e) {
				console.log('error post message', e);
			}
		}

		this.currentOXUser = () => {
			const appVue = document.querySelector('#__app').__vue__;
			if(!appVue || !appVue.$auth){
				return false;
			}

			return {...appVue.$auth.user};
		};

		this.callOxApi = async (path, param, method = 'POST') => {
			const appVue = document.querySelector('#__app').__vue__;
			const {user} = appVue.$auth;
			const {apiURL, domainID} = appVue.$config;

			const url = `${apiURL}${path}`;
			const fetchConfig = {
				"headers": {
					"accept": "application/json, text/plain, */*",
					"accept-language": "en-US,en;q=0.9",
					"authorization": `Bearer ${user.token_id}`,
					"content-type": "application/json;charset=UTF-8",
					"idnc-app": "0",
					"idnc-domain-id": domainID,
					"idnc-ismobile": "1",
					"idnc-language": "id",
				},
				"referrer": window.location.origin,
				"referrerPolicy": "strict-origin-when-cross-origin",
				method,
				"mode": "cors",

				//'cache': 'no-store'
			};
			if(method === 'POST'){
				fetchConfig.body = JSON.stringify(param);
			}
			return fetch(url, fetchConfig).then(res => res.json());
		};

		let cachedBankList = null;
		this.getBankList = async () => {
			if(cachedBankList !== null){
				return cachedBankList;
			}

			const res = await this.callOxApi('/deposit/banks', null, 'GET');
			if(!res){
				return {};
			}

			cachedBankList = res;
			return cachedBankList;
		};

		this.getAvailBonus = async	() => {
			const bankList = await this.getBankList();
			if(!bankList.banks){
				return {error: 'EMPTY_BONUS'};
			}

			const bonusList = bankList.banks[0].bonus;
			if(!Array.isArray(bonusList) || !bonusList.length){
				return [];
			}

			return [...bonusList];
		};

		this.oxBankDepo = async function(depoParam){
						//return Promise.resolve('dev only');
			
			const {amount, bonusId, notes} = depoParam;

			// clear cache
			cachedBankList = null;
			const bankList = await this.getBankList();

			if(!bankList.banks){
				if(bankList.pending){
					return {error: 'ADA PENDING DEPOSIT'};
				}
				return {error: 'EMPTY_BANK'};
			}
			const banks = bankList.banks;
			const userInfo = this.currentOXUser();
			const {user_id, token_id: token, username} = userInfo
			if(!token || !token.length){
				return {error: 'NO_TOKEN'};
			}

			const bankInfo = banks[0];
			const {bank_accnum, bank_accname, payment_method_code} = bankInfo;

			const param = {
				"amount": amount|0,
				"bonus_id": bonusId > 0 ? bonusId : '',
				"user_note": notes,
				"bank_accnum": bank_accnum,
				"bank_accname": bank_accname,
				"code": payment_method_code,

				"payment_method":"banks",
				"is_pga":false
			}

			return this.callOxApi('/deposit/createBill', param);
		};

		let _initialized = false;
		this.init = async function(){
			
			if(_initialized){
				console.log('redundant initializer, abort.');
				return;
			}
			_initialized = true;
			document.body.classList.add('dyn-' + BASE_ID);

			const dynMessageFlag = Math.random();
			window.__dynMessageFlag = dynMessageFlag;

			// iframe communication
			window.addEventListener('message', async (e) => {
				if(!e.data._dyn_call_){
					return;
				}

				if(window.__dynMessageFlag !== dynMessageFlag){
					console.log('ignore message, flag mismatch', window.__dynMessageFlag, dynMessageFlag);
					return;
				}

				const {method, param, callbackId} = e.data._dyn_call_;
				let result;
				if(typeof self[method] !== 'function'){
					result = 'UNKNOWN METHOD: ' + method;
				} else {
					result = await self[method](param);
				}

				//console.log('dyncall async message', e.data);
				try {
					//console.log('sending dynreply');
					//window.frames['qris-frame'].postMessage({
					e.source.postMessage({
						'_dyn_reply_': {
							callbackId,
							result
						}
					}, '*');
				} catch (e) {
					console.log('error post dyn reply message', e);
				}
			});

			if(mobile === null){
				mobile = window.innerWidth <= 768;
			}

			param = {
				b: "QRIS OTOMATIS", // bankname to capture
				//u: currentUsername(),
				u: await getUntranslatedUsername(currentUsername()),
				m: mobile ? 1 : 0,
				t: (new Date()).getTime(),
				r: w.location.toString(),

				v: "6.7.0"			};
			console.log('qr param', param);
			if(!!w.qrConfig){
				param.css = w.qrConfig.externalStyle;
				param.accent = w.qrConfig.accentColor ?? param.accent;
				param.did = w.qrConfig.daemonid ?? param.did;
				if(w.qrConfig.bankname){
					param.b = w.qrConfig.bankname;
				}
			}
			FORM_URL = `${BASE_URL}/form?${(new URLSearchParams(param)).toString()}`;
			// fix no application installed
			FORM_URL = FORM_URL.replace(/(\/+)qr$/, '/qr');

			console.log('is mobile', mobile);
			const divCls = `_qris_form_${BASE_ID}`;
			let tmp = document.querySelector(`#_dyn_qris_form_add_.${divCls}`);
			if(tmp){
				tmp.remove();
			}

			const form = document.createElement('div');
			form.id = '_dyn_qris_form_add_';
			form.classList.add(divCls);
			form.innerHTML = `<iframe name='qris-frame' id="_dyn_qris_form_" src='${FORM_URL}' loading="lazy"></iframe>`;
			form.style.display = 'none';

			function injectForm(){
				if(formInjected && !!document.querySelector('iframe[name="qris-frame"]')){
					console.log('abort, form already injected');
					return;
				}

				try {
					//const bankDom = document.querySelector('#divdepoform');
					const bankDom = document.querySelector('div.deposit-content:not(#injectautodepoqris)');
					if(!bankDom){
						setTimeout(() => injectForm(), 10);
						return;
					}

					bankDom.appendChild(form);
					formInjected = true;
				} catch (e) {
					formInjected = false;
				}
			}

			if(mobile) {
				/*
				qrisBtn.removeEventListener('click', this.showForm);
				qrisBtn.addEventListener('click', this.showForm);
				if(qrisBtn.matches('.active')){
					qrisBtn.click();
				}
				// */
				form.classList.add('mobile-site');

				//const observeTarget = document.querySelector('.dd-selected');
				const observeTarget = document.body;
				if(!observeTarget){
					setTimeout(Dyn.init, 500);
					return;
				}

				injectForm();
				const observerOptions = {
					attributes: true,
					characterData: true,
					characterDataOldValue: true,
					subtree: true
				};

				const getSelectedBank = () => {
					const el = document.querySelector('.bank-select__item .bank-select__input:checked');
					if(!el){
						return 'no_bank_el';
					}

					return (() => {
						try {
							return el.previousElementSibling.querySelector('img').getAttribute('alt');
						} catch (e) {
							console.error('Error reading selected bank text', e);
							return 'err_read_bank';
						}
					})();
				};

				const showMobileForm = () => {
					injectForm();
					form.style.display = 'initial';
					postMessageToFrame(getSelectedBank());
				};

				const observer = new MutationObserver(function([ob_el]) {
					generateQrisButton(form, showMobileForm);
					const el = document.querySelector('.bank-select__item .bank-select__input:checked');
					if(!el){
						console.log('no bank-item found, prev was ' + PrevSelected);
						if(PrevSelected.length > 3) {
							form.style.display = 'none';
						}
						PrevSelected = '-';
						return;
					}

					const text = getSelectedBank();
					console.log('observe', el, text);
					if(text === PrevSelected){
						//console.log('skip not changing');
						return;
					}

					PrevSelected = text;
					const captureBanks = param.b.split(',').map(b => b.trim().toLowerCase());
					if(captureBanks.includes(text.trim().toLowerCase())){
						console.log('capture bank', text);
						showMobileForm();
						let topPos = 550;
						try {
							const bankSelect = document.querySelector('.bank-select');
							topPos = 15 + (bankSelect.offsetTop + bankSelect.offsetHeight);
							if(isNaN(topPos)){
								console.log('topPos is NaN', topPos, bankSelect);
								topPos = 395; // best guess
							}
						} catch (e) {
							console.error('error reading .bank-select position');
						}
						console.log('displaying form at top', topPos);
						form.style.top = topPos + 'px';
					} else {
						form.style.display = 'none';
					}
				});
				//console.log('starting to observe', observeTarget);
				observer.observe(observeTarget, observerOptions);

				const captureBanks = param.b.split(',').map(b => b.trim().toLowerCase());
				if(captureBanks.includes(getSelectedBank())){
					showMobileForm();
				}

				generateQrisButton(form, showMobileForm);
			} else {
				installDesktop(form);
			}
		};
	})();

	window.addEventListener('load', () => {
		console.log('ev load, start...');
		setTimeout(() => Dyn.init(), 100)
	});

	if(document.readyState === 'complete') {
		console.log('ev readyState complete, start...');
		Dyn.init();
	}
})();