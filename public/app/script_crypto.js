let Web3Modal = window.Web3Modal.default;
let WalletConnectProvider = window.WalletConnectProvider.default;
let EvmChains = window.EvmChains;
let Fortmatic = window.Fortmatic;
let Torus = window.Torus;
let Authereum = window.Authereum;
let UniLogin = window.UniLogin;
let web3Modal, selectedAccount, accounts,balance,selectedBalance,tcurr, contract, stakingContract,tbal,contractbalance, stakingcontractownerwallet,chainId,chainData, stakingContractBalance, stakingWalletBalance,allowancegranted, arrreward;
let web3, provider, infuraid, providerOptions, govlist, busdBalance,creoBalance, creoTotalSupply, totaljmlvesting, totalnilaivesting;
let salearr = [];
let currentsaleprice, currentsalepriceinwei, currentsaleperiod, currentsalekuota, currentsaleallocation, saleredeemtime;
function numberformat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(document).ready(()=>{
  $('#input-set-mulai').datetimepicker({ footer:true,  modal: false, size: 'small' });
  $('#input-set-selesai').datetimepicker({ footer:true,  modal: false, size: 'small' });
  $('#input-set-likuidasi').datetimepicker({ footer:true,  modal: false, size: 'small' });
  $('#input-set-vesting-likuidasi').datetimepicker({ footer:true,  modal: false, size: 'small' });
  toastr.options = {
    // "target": "body",
    // "position":"fixed"
    // "closeButton": false,
    // "debug": false,
    // "newestOnTop": false,
    // "progressBar": false,
    // "positionClass": "toast-top-full-width",
    // "preventDuplicates": false,
    // "onclick": null,
    // "showDuration": "300",
    // "hideDuration": "1000",
    // "timeOut": "2000",
    // "extendedTimeOut": "500",
    // "showEasing": "swing",
    // "hideEasing": "linear",
    // "showMethod": "fadeIn",
    // "hideMethod": "fadeOut"
  }
  initwallet();
});

function getepoch(d){
  var date = new Date(d);
  var timestamp = Math.floor(date.getTime()/1000.0); 
  return timestamp;
}

function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}

function getdate(epoch,tipe){
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
     "November",
     "December"
  ];

  var d=new Date(epoch*1000);
  var dd=d.getDate();
  var mm=d.getMonth();
  var yy=d.getFullYear();
  var hh=addZero(d.getHours());
  var ii=addZero(d.getMinutes());

  if(tipe==1){
    return dd+" "+month[mm]+" "+yy+", "+hh+":"+ii;
  }else{
    return hh+":"+ii+" "+(mm+1)+"/"+dd+"/"+yy;
  }
}

async function initwallet(){
  infuraid="2283a24290d44e84b146d65d492d97ca";
	providerOptions = {
		walletconnect: { 
			package: WalletConnectProvider,
			options: {
				infuraId: infuraid
			}
		},
		fortmatic: {
			package: Fortmatic,
			options: {
				key: "pk_test_391E26A3B43A3350"
			}
		},
    torus: {
        package: Torus, // required
    },
    authereum: {
        package: Authereum // required
    },
	};

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  };

  web3Modal = new Web3Modal({
		// theme: "dark",
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  try {
    provider = await web3Modal.connect();
    web3.eth.getAccounts()
    .then(async (addr) => {
      fetchAccountData();
    });
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
}

async function disconnectwallet() {
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount=null;
  $('#divconnectwallet').html(`
    <button className='btn btn-primary'  onclick="connectwallet()">
        Connect Wallet
    </button>
  `);
}

async function connectwallet() {
  fetchAccountData();
}

async function refreshAccountData() {
  console.log("refreshing account data");
	await fetchAccountData();
}

function shortenaddress(x){
  var a=x.slice(0,4);
  var b=x.slice(-4);
  return a+"..."+b;
}

async function fetchAccountData() {
  provider = await web3Modal.connect();
  provider.on("accountsChanged", (accounts) => {
    console.log("acount changed");
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    console.log("chain changed");
    fetchAccountData();
  });

  provider.on("networkChanged", (networkId) => {
    console.log("network changed");
    fetchAccountData();
  });

	web3 = new Web3(provider);
	chainId = await web3.eth.getChainId();
	accounts = await web3.eth.getAccounts();
	selectedAccount = accounts[0];
  selectedaccountshort=shortenaddress(selectedAccount);
  $('#divconnectwallet').html(`
    <button className='btn btn-success'  onclick="disconnectwallet()">
      Connected With ${selectedaccountshort}
    </button>
  `);
  
  balance = await web3.eth.getBalance(selectedAccount);
  var selectedCurr = web3.utils.fromWei(balance, "ether");
  selectedBalance = parseFloat(selectedCurr).toFixed(4);

  setupcreo();
}

async function refreshcreobalance() {
  creoBalance=await creoToken.methods.balanceOf(selectedAccount).call();
  creobalanceshort = web3.utils.fromWei(creoBalance, "ether").toString();
  $('#creo-owned').html(numberformat(creobalanceshort));
}

async function setupcreo() {
  creoToken = new web3.eth.Contract(creoabi,creocontract);
  busdToken = new web3.eth.Contract(busdabi,busdcontract);
  creoBalance=await creoToken.methods.balanceOf(selectedAccount).call();
  creobalanceshort = web3.utils.fromWei(creoBalance, "ether").toString();
  creoapp = new web3.eth.Contract(creoappabi,creoappcontract);
  creoAllowanceToApp=await creoToken.methods.allowance(selectedAccount,creoappcontract).call();
  creoTotalSupply=await creoToken.methods.totalSupply().call();
  busdBalance=await busdToken.methods.balanceOf(selectedAccount).call();
  busdAllowanceToApp=await busdToken.methods.allowance(selectedAccount,creoappcontract).call();
  $('#creo-owned').html(numberformat(creobalanceshort));
  setupgovdetail();
  await setupsaledetail();
  setupvestingdetail();
  getlikuidasi();
  setupactivesale();
  setupbuyerdetail();
}

async function setactivesale() {
  var x = $('#opsi-active-sale').val();
  setloading('btn-set-active-sale');
  await creoapp.methods.setactivesale(x)
    .send({ from: selectedAccount }, function (err, res) {
      if (err) {
        console.log(err);
        $('#btn-approve-' + x).attr("disabled", false);
        $('#btn-approve-' + x).html(" Approve");
        return;
      }
    }
  );
  $('#btn-set-active-sale').html(`
    <i className='fa fa-check mr-3'></i>
    Set
  `);
  $('#btn-set-active-sale').attr('disabled',false);
  toastr.success("Active Sale Set");
}

async function redeembuytoken(vestingindex,buyindex, redeemperiod) {
  var thebtn = `redeem-buy-token-period-${vestingindex}-${buyindex}-${redeemperiod}`;
  setloading(thebtn);
  await creoapp.methods.redeemBuyToken(
    vestingindex,
    buyindex,
    redeemperiod
  )
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      $('#'+thebtn).html(`
        Redeem      
      `);
      $('#'+thebtn).attr('disabled',false);
      return;
    }
  });
  toastr.success("Token Redeemed");
  refreshcreobalance();
  setupbuyerdetail();
  return;
}
async function redeemvestingperiod(redeemerindex, redeemperiod) {
  var a = await creoapp.methods.checkvestingperiodredeemed(selectedAccount, redeemerindex, redeemperiod).call();
  if (a) {
    toastr.warning("Vesting Has Been Redeemed");
    return;
  }
  var thebtn = `redeem-vesting-period-${redeemerindex}-${redeemperiod}`;
  setloading(thebtn);
  await creoapp.methods.redeemVesting(
    redeemerindex,
    redeemperiod
  )
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      $('#'+thebtn).html(`
        Redeem      
      `);
      $('#'+thebtn).attr('disabled',false);
      return;
    }
  });
  toastr.success("Vesting Redeemed");
  refreshcreobalance();
  setupbuyerdetail();
  return;
}
async function redeemvesting(index) {
  await creoapp.methods.redeemVesting(index)
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      // $('#btn-buy-now').html(`
      //   Buy Now
      // `);
      // $('#btn-buy-now').attr('disabled',false);
      // return;
    }
  });
}

async function setupbuyerdetail() {
  var c = await creoapp.methods.getredeemerList(selectedAccount).call();
  var now = Date.now() / 1000;
  totaljmlvesting = 0;
  $('#vesting-list').html('');
  var vestinglist = '';
  var purchaselist = '';
  var li = "-";
  if (c.length > 0) {
    var buyindex = 0;
    for (var i = 0; i < c.length; i++){
      var e = await creoapp.methods.getVestingProgram(c[i]).call();
      var jmlredeemable = 0;
      var daftarredeem = '';
      var keterangan = e[3];
      var nilaivt, banyakredeem, jedaredeem, initredeem, periredeem;
      var redeemedlist = [];
      if (e[0] > 0) {
        buyindex++;
        var buyerdetail = await creoapp.methods.getdetailbuyer(
          selectedAccount,
          c[i],
          buyindex
        ).call();

        console.log("buyerdetail");
        console.log(buyerdetail);
        nilaivt = web3.utils.fromWei(buyerdetail[0], 'ether');
        banyakredeem = parseInt(buyerdetail[2]);
        jedaredeem = parseInt(buyerdetail[1]);
        initredeem = parseFloat(web3.utils.fromWei(buyerdetail[3],'ether'));
        periredeem = parseFloat(web3.utils.fromWei(buyerdetail[4], 'ether'));
        redeemedlist = await creoapp.methods.getsaleredeemedList(selectedAccount, c[i], buyindex).call();
      } else {
        nilaivt = web3.utils.fromWei(e[1], 'ether');
        banyakredeem = parseInt(e[2]);
        jedaredeem = parseInt(e[4]);
        initredeem = parseFloat(web3.utils.fromWei(e[5],'ether'));
        periredeem = parseFloat(web3.utils.fromWei(e[6], 'ether'));
        redeemedlist = await creoapp.methods.getredeemedList(selectedAccount, c[i]).call();
      }

      var redeemedlistinint = [];
      for (var k = 0; k < redeemedlist.length; k++){
        redeemedlistinint.push(parseInt(redeemedlist[k]));
      }
      for (var j = 0; j <= banyakredeem; j++){
        var redeemamount = periredeem;
        var redeemtitle = `Redeem ${j}`;
        if (j == 0) {
          redeemamount = initredeem;
          redeemtitle = 'TGE Value';
        }
        var redeembtn = `
          <button className='btn btn-danger'>
            Locked
          </button>
        `;
        var lockeduntil = '';
        if (saleredeemtime > 0) {
          if (redeemamount > 0) {
            var timeshouldbereleased = saleredeemtime + (j * jedaredeem);
            if (now < saleredeemtime) {
              var li = getdate(saleredeemtime, 1);
              lockeduntil = `
                <div className='row'>
                  <div className='col text-center text-primary'>
                    Redeemable After : ${li}
                  </div>
                </div>
              `;
            }else{
              var li = getdate(timeshouldbereleased, 1);
              lockeduntil = `
                <div className='row'>
                  <div className='col text-center text-primary'>
                    Unlocked At : ${li}
                  </div>
                </div>
              `;
              if (now < timeshouldbereleased) {
                redeembtn = `
                  <button className='btn btn-danger'>
                    Locked
                  </button>
                `;
              } else {
                if (redeemedlistinint.includes(j)) {
                  redeembtn = ``;
                  lockeduntil = `
                    <div className='row'>
                      <div className='col text-center text-success'>
                        Already Redeemed
                      </div>
                    </div>
                  `;
                } else {
                  if (e[0] > 0) {
                    redeembtn = `
                      <button className='btn btn-success' onclick="redeembuytoken('${c[i]}','${buyindex}','${j}')" id='redeem-buy-token-period-${c[i]}-${buyindex}-${j}'>
                        Redeem
                      </button>
                    `;
                  } else {
                    redeembtn = `
                      <button className='btn btn-success' onclick="redeemvestingperiod('${c[i]}','${j}')" id='redeem-vesting-period-${c[i]}-${j}'>
                        Redeem
                      </button>
                    `;
                  }
                  lockeduntil = `
                    <div className='row'>
                      <div className='col text-center text-success'>
                        Unlocked
                      </div>
                    </div>
                  `;
                }
              }
            }
          }
        }
        daftarredeem += `
          <div className='mb-3'>
            <div className='row'>
              <div className='col'>
                ${redeemtitle}
              </div>
              <div className='col'>
                ${numberformat(redeemamount)}
              </div>
              <div className='col'>
                ${redeembtn}
              </div>
            </div>
            ${lockeduntil}
          </div>
          <hr/>
        `;
      }
      totaljmlvesting++;
      vestinglist+=`
        <div className="card mb-3">
          <div className="card-header bg-primary text-white">
              <div className="row">
                  <div className="col text-left">
                      ${keterangan}
                  </div>
                  <div className="col">
                      ${numberformat(nilaivt)} CREO
                  </div>
                  <div className="col text-right">
                      <a href='#detilvesting${i}' data-toggle='collapse'>
                          ${jmlredeemable} Redeemable
                      </a>
                  </div>
              </div>
          </div>
          <div className="collapse" id='detilvesting${i}'>
              <div className="card-body">
                  ${daftarredeem}
              </div>
          </div>
        </div>
      `;
    }
  }
  var alllist = vestinglist + purchaselist;
  $('#vesting-list').html(alllist);
}

async function getvestingdetail(i) {
  var vt = await creoapp.methods.getVestingProgram(i).call();
  var nilaivt = web3.utils.fromWei(vt[1], 'ether');
  var vestingperiod = parseInt(vt[4])/60; //dalam menit
  var nilaiinit = web3.utils.fromWei(vt[5], 'ether');
  var nilaiperiodik = web3.utils.fromWei(vt[6], 'ether');
  if (vt[0] > 0) {
    nilaiinit = '-';
    nilaiperiodik='-'
  } else {
    nilaiinit = numberformat(nilaiinit)+" CREO";
    nilaiperiodik = numberformat(nilaiperiodik)+" CREO";
  }
  $('#daftarvesting').append(`
    <tr>
      <td>
        ${vt[3]}
      </td>
      <td>
        ${numberformat(nilaivt)}
      </td>
      <td>
        ${nilaiinit}
      </td>
      <td>
        ${vestingperiod} Days
      </td>
      <td>
        ${nilaiperiodik}
      </td>
    </tr>
  `);
  $('#totalvesting').html(
    parseFloat($('#totalvesting').html()) + parseFloat(nilaivt)
  );
}

async function setupvestingdetail() {
  totaljmlvesting = 0;
  totaljmlvesting=await creoapp.methods._nextVestingIndex().call();
  $('.banyakvesting').html(totaljmlvesting);
  $('#daftarvesting').html('');
  $('#vesting-list').html('');
  if (totaljmlvesting > 0) {
    for (var i = 0; i < totaljmlvesting; i++) {
      var a = getvestingdetail(i);
    }
  }
  
  if(govlist.includes(selectedAccount)){
    $('#footer-tambahadmin').html(`
        <div className='card-footer text-center'>
          <button className='btn btn-success' data-target='#modal-tambahadm' data-toggle='modal'>
              <i className='fa fa-plus mr-3'></i>
              Tambah Admin
          </button>
        </div>
    `);
    $('#set-sale1').html(`
      <button className='btn btn-success' onclick="setsalemodal('1')">
          <i className='fa fa-cog'></i>
      </button>
    `);
    $('#set-sale2').html(`
      <button className='btn btn-success' onclick="setsalemodal('2')">
          <i className='fa fa-cog'></i>
      </button>
    `);
    $('#set-sale3').html(`
      <button className='btn btn-success' onclick="setsalemodal('3')">
          <i className='fa fa-cog'></i>
      </button>
    `);
  }else{
    $('#footer-tambahadmin').html(``);
    $('#set-sale1').html(``);
    $('#set-sale2').html(``);
    $('#set-sale3').html(``);
  }
  var admlist='';
  for(var i=0; i<govlist.length; i++){
    var y=shortenaddress(govlist[i]);
    admlist+=`
      <div className="row mb-3">
        <div className="col align-self-center">
            ${y}
            <span className='ml-3'>
                <button className='btn btn-danger' onclick="removegov('${govlist[i]}')">
                    <i className='fa fa-times'></i>
                </button>
            </span>
        </div>
      </div>
    `;
    $('#div-card-admin').html(admlist);
  }
}

async function setupgovdetail(){
  govlist=await creoapp.methods.getgovernance().call();
  $('#jmladmin').html(govlist.length);

  if(govlist.includes(selectedAccount)){
    $('#footer-tambahadmin').html(`
        <div className='card-footer text-center'>
          <button className='btn btn-success' data-target='#modal-tambahadm' data-toggle='modal'>
              <i className='fa fa-plus mr-3'></i>
              Tambah Admin
          </button>
        </div>
    `);
    $('#set-sale1').html(`
      <button className='btn btn-success' onclick="setsalemodal('1')">
          <i className='fa fa-cog'></i>
      </button>
    `);
    $('#set-sale2').html(`
      <button className='btn btn-success' onclick="setsalemodal('2')">
          <i className='fa fa-cog'></i>
      </button>
    `);
    $('#set-sale3').html(`
      <button className='btn btn-success' onclick="setsalemodal('3')">
          <i className='fa fa-cog'></i>
      </button>
    `);
  }else{
    $('#footer-tambahadmin').html(``);
    $('#set-sale1').html(``);
    $('#set-sale2').html(``);
    $('#set-sale3').html(``);
  }

  var admlist='';
  for(var i=0; i<govlist.length; i++){
    var y=shortenaddress(govlist[i]);
    admlist+=`
      <div className="row mb-3">
        <div className="col align-self-center">
            ${y}
            <span className='ml-3'>
                <button className='btn btn-danger' onclick="removegov('${govlist[i]}')">
                    <i className='fa fa-times'></i>
                </button>
            </span>
        </div>
      </div>
    `;
    $('#div-card-admin').html(admlist);
  }
}

async function approveapp(x){
  var tokenapp,theamount;
  if(x=='busd'){
    tokenapp = busdToken;
    theamount=busdBalance
  }
  if(x=='creo' || x=='creo-vesting'){
    tokenapp = creoToken;
    theamount=creoBalance
  }
  // console.log("approving " + theamount);
  // return;

  
  setloading("btn-approve-"+x);



  await tokenapp.methods
    .approve(creoappcontract,theamount)
    .send({from : selectedAccount },function(err,res){
      if(err){
        console.log(err);
        $('#btn-approve-'+x).attr("disabled",false);
        $('#btn-approve-'+x).html(" Approve");
        return;
      }
    }
  );

  if (x == 'busd') {
    busdAllowanceToApp=await busdToken.methods.allowance(selectedAccount,creoappcontract).call();
  }
  if (x == 'creo') {
    creoAllowanceToApp=await creoToken.methods.allowance(selectedAccount,creoappcontract).call();
  }

  $('#btn-approve-'+x).attr("disabled",false);
  $('#btn-approve-'+x).html(" Approve");
}

async function getactivesale() {
  var x = await creoapp.methods._activesale().call();
  return x;
}

async function setupactivesale() {
  var i =await getactivesale();
  if (i > 0) {
    $('#div-active-sale').html(i);
    currentsaleperiod = i;
    currentsaleprice = salearr[i - 1][3] / 100000;
    currentsalekuotainwei = web3.utils.fromWei(salearr[i-1][0],'ether');
    currentsalesoldinwei = web3.utils.fromWei(salearr[i - 1][5], 'ether');
    var mulai=getdate(salearr[i-1][1],1);
    var selesai = getdate(salearr[i - 1][2], 1);
    var timenow = Date.now() / 1000;

    console.log("currentsaleprice : " + currentsaleprice);

    if (parseFloat(salearr[i - 1][1]) > timenow) {
      $('#div-to-open-buy').html(`
        <button className='btn btn-muted' disabled>
          Sale Not Started
        </button>
      `);
    }else if (salearr[i - 1][2] < timenow) {
      $('#div-to-open-buy').html(`
        <button className='btn btn-danger' disabled>
          Sale Ended
        </button>
      `);
    } else {
      $('#div-to-open-buy').html(`
        <button className='btn btn-success' data-toggle='modal' data-target='#modal-buy-token'>
            Buy Now
        </button>
      `);
    }
    currentsaleremaininginwei = currentsalekuotainwei - currentsalesoldinwei;
    currentsaleallocation = (salearr[i - 1][0] / creoTotalSupply).toFixed(2);

    $('.sale-period').html(i);
    $('.sale-price').html(currentsaleprice+" BUSD");
    // $('.sale-price').html(numberformat(currentsaleprice)+" BUSD");
    $('.sale-start').html(mulai);
    $('.sale-end').html(selesai);
    $('.sale-kuota').html(numberformat(currentsalekuotainwei)+"<br/>CREOENGINE");
    $('.sale-remaining').html(numberformat(currentsaleremaininginwei)+" CREOENGINE");
    $('.sale-allocation').html(currentsaleallocation);
  }
}

function calctotalbuy(x) {
  var t = x * currentsaleprice;
  $('#totalbuy').html(t);
}

async function buytoken() {
  var amount = $('#buyamount').val();
  if (amount == '' || amount <= 0) {
    toastr.warning("Invalid Amount");
    return;
  }
  var period = await creoapp.methods._activesale().call();
  var detail = await creoapp.methods.getdetailsale(period).call();
  var kuota = detail[0];
  var price = detail[3]/100000;
  var start = detail[1];
  var end = detail[2];
  var now = Date.now() / 1000;
  if (start > now) {
    toastr.warning("Sale not started yet");
    return;
  }
  if (end < now) {
    toastr.warning("Sale has ended");
    return;
  }
  var amountinwei = web3.utils.toWei(amount.toString(), "ether");
  if (parseFloat(amountinwei) > parseFloat(kuota)) {
    toastr.warning("Insufficient Kuota To Purchase");
    return;
  }
  var totalprice = amount * price;
  var totalpriceinwei = web3.utils.toWei(totalprice.toString(), 'ether');
  busdBalance=await busdToken.methods.balanceOf(selectedAccount).call();
  busdAllowanceToApp=await busdToken.methods.allowance(selectedAccount,creoappcontract).call();
  if (parseFloat(busdBalance) < parseFloat(totalpriceinwei)) {
    toastr.warning("Insufficient BUSD Balance to make purchase");
    return;
  }
  if (parseFloat(busdAllowanceToApp) < parseFloat(totalpriceinwei)) {
    toastr.warning("Insufficient BUSD Allowance to make purchase, Approve First");
    return;
  }
  setloading('btn-buy-now');
  await creoapp.methods.buytoken(amountinwei)
   .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      $('#btn-buy-now').html(`
        Buy Now
      `);
      $('#btn-buy-now').attr('disabled',false);
      return;
    }
   });
  
   $('#btn-buy-now').html(`
    Buy Now
  `);
  $('#btn-buy-now').attr('disabled',false);
  toastr.success("Buy Success");
  setupbuyerdetail();
  $('#modal-buy-token').modal('hide');
}

async function setupsaledetail(){
  var totalcreodijual=0;
  var totalcreoterjual=0;
  var totalbusdterkumpul=0;
  // var totaljumlahpembeli = 0;
  saleredeemtime = parseInt (await creoapp.methods._releasetime().call());
  for(var i=1; i<=3; i++){
    seedd=await creoapp.methods.getdetailsale(i).call();
    if (seedd[0] != '0') {
      salearr.push(seedd);
      var hh = parseFloat(seedd[3]) / 100000;
      var harga=numberformat(hh);
      var mulai=getdate(seedd[1],1);
      var selesai=getdate(seedd[2],1);
      var vestingindex = seedd[4];
      var vestingdetail = await creoapp.methods.getVestingProgram(vestingindex).call();
      
      var initpercentage = vestingdetail[5] / 100;
      var releasetimes = vestingdetail[2];
      var jedaredeem = vestingdetail[4] / 60 //ini dalam itungan detik
      

      creodijual=web3.utils.fromWei(seedd[0],'ether');
      totalcreodijual+=parseFloat(creodijual);
      creoterjual=web3.utils.fromWei(seedd[5],'ether');
      busdterkumpul = parseFloat(creoterjual) * parseFloat(hh);
      totalcreoterjual+=parseFloat(creoterjual);
      totalbusdterkumpul+=parseFloat(busdterkumpul);
      // totaljumlahpembeli+=parseInt(pembeli);
      $('#ss-terkumpul-'+i).html(numberformat(busdterkumpul.toFixed(2)));
      $('#ss-kuota-'+i).html(numberformat(creodijual));
      $('#ss-mulai-'+i).html(mulai);
      $('#ss-selesai-'+i).html(selesai);
      $('#ss-harga-'+i).html(harga);
      // $('#ss-pembeli-'+i).html(pembeli);
      $('#ss-terjual-'+i).html(creoterjual);
      $('#ss-beneficiary-' + i).html(shortenaddress(seedd[6]));
      $('#ss-tge-'+i).html(initpercentage+" %");
      $('#ss-jeda-'+i).html(jedaredeem+" Hari");
      $('#ss-kali-'+i).html(releasetimes+" Kali");
      
      var mm = await creoapp.methods.getdetailsalesetting(i).call();
      var minineth = web3.utils.fromWei(mm[0], 'ether').toString();
      var maxineth = web3.utils.fromWei(mm[1], 'ether').toString();
      $('#ss-min-' + i).html(`
        ${minineth}
      `);
      $('#ss-max-' + i).html(`
        ${maxineth}
      `);
      if(govlist.includes(selectedAccount)){
        $('#ss-min-' + i).append(`
          <span className='ml-3'>
            <button className='btn btn-success' onclick="setminmax('${i}')">
              <i className='fa fa-cog'></i>
            </button>
          </span>
        `);
        $('#ss-max-' + i).append(`
          <span className='ml-3'>
            <button className='btn btn-success' onclick="setminmax('${i}')">
              <i className='fa fa-cog'></i>
            </button>
          </span>
        `);
      }
    }
  }
  $('#total-creo-dijual').html(numberformat(totalcreodijual));
  $('#total-creo-terjual').html(numberformat(totalcreoterjual));
  $('#total-busd-terkumpul').html(numberformat(totalbusdterkumpul.toFixed(2)));
  // $('#total-jumlah-pembeli').html(totaljumlahpembeli);
}

function setminmax(periode) {
  $('.set-periode').html(periode);
  $('#modal-setminmax').modal('show');
}

async function setminmaxprogram(){
  var p = $('.set-periode').html();
  var min = $('#input-set-min').val();
  var max = $('#input-set-max').val();
  if (min > max) {
    toastr.warning("Minimum lebih besar dari Maximum");
    return;
  }

  var mininwei = web3.utils.toWei(min, 'ether');
  var maxinwei = web3.utils.toWei(max, 'ether');

  setloading('btn-set-minmax-program');

  await creoapp.methods.setsalesetting(p,mininwei,maxinwei)
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      $('#btn-set-minmax-program').html(`
        <i className='fa fa-save mr-3'></i>
        Set Min Max Periode <span className='set-periode'>${periode}</span>
      `);
      $('#btn-set-minmax-program').attr('disabled',false);
      return;
    }
  });

  toastr.success("Min Max Program Ter Set");
  setupsaledetail();
  $('#btn-set-minmax-program').html(`
      <i className='fa fa-save mr-3'></i>
      Set Min Max Periode <span className='set-periode'>${periode}</span>
  `);
  $('#btn-set-minmax-program').attr('disabled', false);
  $('#modal-setminmax').modal('hide');
}
  


async function addgovernance(){
  var w=$('#input-set-governance').val();
  if(w==''){
    toastr.warning("Alamat Wallet Kosong");
    return;
  }
  if(govlist.includes(w)){
    toastr.warning("Sudah Wallet Governance");
    return;
  }
  setloading('btn-set-gov');
  await creoapp.methods.setgovernance(w)
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      $('#btn-set-gov').html(`
        <i className='fa fa-plus mr-3'></i>
        Tambah
      `);
      $('#btn-set-gov').attr('disabled',false);
      return;
    }
  });
  var y=shortenaddress(w);
  $('#div-card-admin').append(`
    <div className="row mb-3">
      <div className="col align-self-center">
          ${y}
          <span className='ml-3'>
              <button className='btn btn-danger' onclick="removegov('${w}')">
                  <i className='fa fa-times'></i>
              </button>
          </span>
      </div>
    </div>
  `);
  govlist=await creoapp.methods.getgovernance().call();
  $('#jmladmin').html(govlist.length);
  $('#btn-set-gov').html(`
    <i className='fa fa-plus mr-3'></i>
    Tambah
  `);
  $('#btn-set-gov').attr('disabled',false);
  toastr.success("Governance Ditambahkan");
}

async function removegov(w){
  await creoapp.methods.removegovernance(w)
  .send({from : selectedAccount },function(err,res){
    if(err){
      console.log(err);
      toastr.warning(err);
      return;
    }
  });
  toastr.success("Governance Dihapus");
}

async function setsalemodal(periode) {
  $('.set-periode').html(periode);
  seed=await creoapp.methods.getdetailsale(periode).call();
  if(seed[0]!='0'){
    var hh=  seed[3]/100000;
    var kuota=  web3.utils.fromWei(seed[0], "ether").toString();
    var mulai=getdate(seed[1],2);
    var selesai = getdate(seed[2], 2);
    $('#input-set-kuota').val(kuota);
    $('#input-set-kuota').attr("disabled",true);
    $('#div-revoke').html(`
      <button type="button" id='btn-remove-sale' className="btn btn-danger btn-block" onclick="removesale('${periode}')">
        <i className='fa fa-times mr-3'></i>
        Remove Sale
      </button>
    `);
    $('#input-set-harga').val(hh);
    $('#input-set-mulai').val(mulai);
    $('#input-set-selesai').val(selesai);
    $('#input-set-beneficiary').val(seed[6]);
    
    var vestingindex = seed[4];
    var vestingdetail = await creoapp.methods.getVestingProgram(vestingindex).call();

    var initpercentage = vestingdetail[5] / 100;
    // var initrelease =web3.utils.fromWei( vestingdetail[5],'ether');
    // var periodicpercentage = vestingdetail[5] / 100;
    // var periodicrelease = web3.utils.fromWei(vestingdetail[4],'ether');
    var releasetimes = vestingdetail[2];

    var jedaredeem=vestingdetail[4]/60 //ini dalam itungan detik

    // var totalamount = (parseFloat(periodicrelease) * releasetimes) + parseFloat(initrelease);
    // var initpercent = (parseFloat(initrelease) / totalamount) * 100;

    // console.log("vestingindex");
    // console.log(vestingindex);
    // console.log("vestingdetail");
    // console.log(vestingdetail);
    // console.log("initrelease");
    // console.log(initrelease);


    $('#input-set-awal').val(initpercentage);
    $('#input-set-jeda').val(jedaredeem);
    $('#input-set-kali').val(releasetimes);


    var timenow = Date.now() / 1000;
    var redeemtime = await creoapp.methods._releasetime().call();


    console.log("redeemtime");
    console.log(redeemtime);
    console.log("timenow");
    console.log(timenow);

    if (redeemtime > 0) {
      if (timenow >= redeemtime) {
        $('#input-set-awal').attr("disabled",true);
        $('#input-set-jeda').attr("disabled",true);
        $('#input-set-kali').attr("disabled",true);
      }
    }
  } else {
    $('#div-revoke').html(`
      <button type="button" id='btn-approve-creo' className="btn btn-primary btn-block" onclick="approveapp('creo')">
          <i className='fa fa-check mr-3'></i>
          Approve
      </button>
    `);
    $('#input-set-kuota').val('');
    $('#input-set-kuota').attr("disabled",false);
    $('#input-set-harga').val('');
    $('#input-set-mulai').val('');
    $('#input-set-selesai').val('');
    $('#input-set-beneficiary').val('');
  }
  $('#modal-setsale').modal('show');
}

function setloading(x){
  $('#'+x).html(`
    <i className='fa fa-spin fa-spinner mr-3'></i>
    Processing ...
  `);
  $('#'+x).attr('disabled',true);
}

async function getlikuidasi(){
  var s= await creoapp.methods._releasetime().call();
  if (s > 0) {
    var ss = getdate(s, 1);
    $('#div-likuidasi-sale').html(ss);
  }
}


async function setlikuidasi(){
  var x=$('#input-set-likuidasi').val();
  if(x==''){
    toastr.warning("Tanggal Likuidasi Kosong");
    return;
  }
  var xx=getepoch(x);
  setloading('btn-set-likuidasi');
  await creoapp.methods.setreleasetime(
    xx
  )
  .send({from : selectedAccount },function(err,res){
    if(err){
      $('#btn-set-likuidasi').attr('disabled',false);
      $('#btn-set-likuidasi').html(`
        <i className='fa fa-check mr-3'></i>
        Set Likuidasi
      `);
      console.log(err);
      return;
    }
  });
  toastr.success("Tanggal Likuidasi Set");
  getlikuidasi();
  $('#btn-set-likuidasi').attr('disabled',false);
  $('#btn-set-likuidasi').html(`
    <i className='fa fa-check mr-3'></i>
    Set Likuidasi
  `);
}


async function cancelvesting(index) {
  setloading('btn-cancel-vesting-' + index);
  await creoapp.methods.cancelVesting(index)
   .send({from : selectedAccount },function(err,res){
    if(err){
      $('#btn-cancel-vesting').attr('disabled',false);
      $('#btn-cancel-vesting').html(`
        <i className='fa fa-times'></i>
        Cancel
      `);
      console.log(err);
      return;
    }
   });
  toastr.success("Vesting Cancelled");
  setupvestingdetail();
}
async function setvesting(){
  var keterangan=$('#input-set-vesting-keterangan').val();
  var jumlah=$('#input-set-vesting-jumlah').val();
  var wallet=$('#input-set-vesting-wallet').val();
  var awal=$('#input-set-vesting-awal').val();
  var waktu=$('#input-set-vesting-waktu').val();
  var kali=$('#input-set-vesting-kali').val();
  // var likuidasi=$('#input-set-vesting-likuidasi').val();

  if(keterangan==''){
    toastr.warning("Keterangan Kosong");
    return;
  }
  if(jumlah==''){
    toastr.warning("Jumlah Kosong");
    return;
  }
  if(wallet==''){
    toastr.warning("Wallet Penerima Kosong");
    return;
  }
  if(waktu==''){
    toastr.warning("Jeda Waktu Pencairan Kosong");
    return;
  }
  if(kali==''){
    toastr.warning("Berapa Kali Pencairan Kosong");
    return;
  }
  var jml=web3.utils.toWei(jumlah, "ether");
  creoBalance = await creoToken.methods.balanceOf(selectedAccount).call();
  if (parseFloat(creoBalance) < parseFloat(jml)) {
    console.log("jml");
    console.log(jml);
    console.log("creoBalance");
    console.log(creoBalance);
    toastr.warning("Insufficient Vested CREO Balance");
    return;
  }

  creoAllowanceToApp=await creoToken.methods.allowance(selectedAccount,creoappcontract).call();
  if(parseFloat(creoAllowanceToApp)<jml){
    toastr.warning("Approve CREO First");
    return;
  }
  var releaseperiod = waktu * 60 //untuk dapat detik * jml menit
  var periodik = 100 - awal;
  var itunganinit = jumlah * (awal / 100);
  var itunganperiodik = (((100 - awal) / 100) * jumlah) / kali;
  var initialrelease = web3.utils.toWei(itunganinit.toString(), 'ether');
  var periodicrelease = web3.utils.toWei(itunganperiodik.toString(), 'ether');
  setloading('btn-set-vesting-program');
  await creoapp.methods.setVestingProgram(
    keterangan,
    jml,
    wallet,
    releaseperiod,
    kali,
    (awal*100),
    (periodik*100),
    initialrelease,
    periodicrelease
  )
  .send({from : selectedAccount },function(err,res){
    if(err){
      $('#btn-set-vesting-program').attr('disabled',false);
      $('#btn-set-vesting-program').html(`
        <i className='fa fa-check mr-3'></i>
        Set
      `);
      console.log(err);
      return;
    }
  });
  setupvestingdetail();
  $('#modal-vesting').modal('hide');
  $('#btn-set-vesting-program').attr('disabled',false);
  $('#btn-set-vesting-program').html(`
    <i className='fa fa-check mr-3'></i>
    Set
  `);
  toastr.success("Vesting Program Set");
}

async function removesale(periode) {
  setloading('btn-remove-sale');
  await creoapp.methods.removesaleprogram(periode)
   .send({from : selectedAccount },function(err,res){
    if(err){
      $('#btn-set-likuidasi').attr('disabled',false);
      $('#btn-set-likuidasi').html(`
        <i className='fa fa-check mr-3'></i>
        Set Likuidasi
      `);
      console.log(err);
      return;
    }
   });
  $('#btn-remove-sale').attr('disabled',false);
  $('#btn-remove-sale').html(`
    <i className='fa fa-times mr-3'></i>
    Remove Sale
  `);
  $('#modal-setsale').modal('hide');
  toastr.success("Sale Program Removed");
}


async function setsaleprogram(){
  var kuota=$('#input-set-kuota').val();
  var harga=$('#input-set-harga').val();
  var mulai=$('#input-set-mulai').val();
  var selesai=$('#input-set-selesai').val();
  var beneficiary=$('#input-set-beneficiary').val();
  var periode = $('.set-periode').html();
  var init=$('#input-set-awal').val();
  var jeda=$('#input-set-jeda').val();
  var kali = $('#input-set-kali').val();
  var periodic = 100 - init;


  console.log("init");
  console.log(init);
  console.log("jeda");
  console.log(jeda);
  console.log("kali");
  console.log(kali);
  console.log("periodic");
  console.log(periodic);

  


  if(kuota==''){
    toastr.warning("Kuota Kosong");
    return;
  }
  if(harga==''){
    toastr.warning("Harga Kosong");
    return;
  }
  if(mulai==''){
    toastr.warning("Tanggal Mulai Kosong");
    return;
  }
  if(selesai==''){
    toastr.warning("Tanggal Selesai Kosong");
    return;
  }
  if(beneficiary==''){
    toastr.warning("Wallet Penerima Kosong");
    return;
  }
  if(jeda==''){
    toastr.warning("Jeda Waktu Redeem Kosong");
    return;
  }
  if(kali==''){
    toastr.warning("Berapa Kali Redeem Kosong");
    return;
  }

  var me=getepoch(mulai);
  var se=getepoch(selesai);
  var hw = (parseFloat(harga).toFixed(5)) * 100000;
  var periodikrelease=jeda*60 //dalam hitungan menit
  var kw = web3.utils.toWei(kuota, "ether").toString();
  creoBalance = await creoToken.methods.balanceOf(selectedAccount).call();
  creobalanceshort = web3.utils.fromWei(creoBalance, "ether").toString();
  if(parseFloat(creoBalance)<kw){
    toastr.warning("Insufficient CREO Balance");
    return;
  }
  creoAllowanceToApp = await creoToken.methods.allowance(selectedAccount, creoappcontract).call();
  

  // console.log("creoAllowanceToApp");
  // console.log(creoAllowanceToApp);
  // console.log("kw");
  // console.log(kw);



  // return;

  if(parseFloat(creoAllowanceToApp)<kw){
    toastr.warning("Approve CREO First");
    return;
  }

  // console.log("how : " + hw);
  // return;


  console.log("kw");
  console.log(kw);
  console.log("hw");
  console.log(hw);
  console.log("periodikrelease");
  console.log(periodikrelease);
  console.log("kali");
  console.log(kali);
  console.log("init");
  console.log(init*100);
  console.log("periodic");
  console.log(periodic * 100);
  

  await creoapp.methods.setsaleprogram(
    periode,
    me,
    se,
    kw,
    hw.toString(),
    "Seed Sale "+periode,
    beneficiary,
    periodikrelease,
    kali,
    init * 100,
    periodic*100
  )
  .send({from : selectedAccount },function(err,res){
    if(err){
      $('#btn-set-sale-program').attr('disabled',false);
      $('#btn-set-sale-program').html(`
        <i className='fa fa-plus mr-3'></i>
        Set Sale <span className='set-periode'></span>
      `);
      console.log(err);
      return;
    }
  });
  setupsaledetail();
  $('#modal-setsale').modal('hide');
  $('#btn-set-sale-program').attr('disabled',false);
  $('#btn-set-sale-program').html(`
    <i className='fa fa-plus mr-3'></i>
    Set Seed Sale Periode <span className='set-periode'></span>
  `);
  toastr.success("Sale Program Set");
}

// acc1 : 0x618dB2EF3D36804dA0786E8f2fdCF76792988B37
// penampung : 0x94245E66FDAF0A5685aA7069a528C5e3CA9811d5