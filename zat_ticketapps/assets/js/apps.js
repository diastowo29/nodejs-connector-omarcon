var client = ZAFClient.init();
// $('[data-toggle="popover"]').popover()
$('#paramsInput').popover();

client.on('app.registered', init);
client.on('app.activated', onActive);

var parentGuid = '';

var prodHost = '';

let prodKey = '';
let partnerKey = 'zendesk';
let contentType = 'application/json';
let contentMd5 = '';

var path = '/api/v1/customer-info';

var selectedEnv = '';
var selectedKey = '';
var ticketId = '';

var policiesList;
var claimsList;
let channelSource = '';

$('#profileDiv').hide();
$('#policyDiv').hide();
// $('#claimDiv').hide();

function onActive () {
  // client.context().then(function(zdContext) {
  //   parentGuid = zdContext.instanceGuid;
  // })
}

function init(){
  $('#progressBar').hide();
  // onActive();
  initializeEnv();
}

client.on('ticket.custom_field_5293562309017.changed', function(e) {
  handleClaimChange(e);
});

function initializeEnv () {

  // client.get('ticket').then(function(ticket){
  //   // console.log(ticket)
  //   ticketId = ticket.ticket.id;
  //   requesterEmail = 'budi.budiman@example.com';
  //   // ticket.ticket.requester.identities.forEach(identity => {
  //   //   if (identity.type == 'phone_number') {
  //   //     requesterPhone = identity.value;
  //   //   }
  //   // });
  //   $('#paramsInput').val(requesterEmail);
  // })
  let productFound = false;
  let productId = '';
  client.get('ticket.comments').then(function (comments) {
    comments['ticket.comments'].forEach(comment => {
      if (comment.channelDisplayInfo.product) {
        productFound = true;
        productId = comment.channelDisplayInfo.product.id
      }
    });
    if (productFound) {
      let ppCustomerCall = {
        url: `https://fs.tokopedia.net/inventory/v1/fs/18229/product/info?product_id=${productId}`,
        type: 'GET',
        headers: {
          Authorization: 'Bearer c:YW4wwLTaQnOKMfesf3s3lA'
        },
      };
    
      client.request(ppCustomerCall).then((response) => {
        $('#product-name').text(response.data[0].basic.name)
        $('#product-name-title').text(response.data[0].basic.name)
        $('#product-url').attr("href", response.data[0].other.url)
        
        getBigger();
      })
    }
  })
  
  let getSource = client.get('ticket.customField:custom_field_22587396407065').then(function(ticketChannel) {
    channelSource = ticketChannel['ticket.customField:custom_field_22587396407065'];
    
    // if (channelSource == 'tanya_pasar_polis') {
    //   $('#claimDivTanya').show();
    // } else {
      // $('#claimDivTanya').hide();
    // }
    return;
  });

  let metadata = client.metadata().then(function(metadata) {
    // GET ENV PARAMETER FROM ZENDESK
    prodHost = metadata.settings['Production Env'];
    prodKey = metadata.settings['Production Secret Key'];
    selectedEnv = prodHost;
    return;
  });

  Promise.all([getSource, metadata]).then(function(done) {
    if (channelSource == 'tanya_pasar_polis') {
      blurClaimConvDiv(false);
      getClaimIdTanya();
    }
  })
}

function getClaimIdTanya () {
  client.get('ticket.customField:custom_field_5293562309017').then(function(ticketClaim) {
    let claimId = ticketClaim['ticket.customField:custom_field_5293562309017'];
    getClaimTanya(claimId)
  })
}

function getClaimTanya (claimId) {
  let ppHeader = generatePPHeader(contentMd5, contentType, partnerKey, selectedKey, path);
  
    let ppCustomerCall = {
      type: 'GET',
      headers: ppHeader,
    };
    // console.log(ppCustomerCall)
    client.request(ppCustomerCall).then(function (ppResponse) {
      
      // console.log(ppResponse)
      var responseSample = ppResponse
      if (responseSample.data.claims.length > 0) {
        // $('#KLMCclaimId').text(responseSample.data.claims[0].claim_id)
        $('#KLMCclaimStatus').text(responseSample.data.claims[0].claim_status)
        $('#KLMCclaimNumber').text(responseSample.data.claims[0].claim_number)
        $('#KLMCappNumber').text(responseSample.data.claims[0].application_number)
        $('#KLMCcreatedAt').text(responseSample.data.claims[0].created_at)
        $('#KLMCprodName').text(responseSample.data.claims[0].product_name)
        $('#KLMCclaimDetailLink').prop('href', responseSample.data.claims[0].details_link)
        $('#KLMCclaimDetailLink').show();
      } else {
        // $('#KLMCclaimId').text('No Data')
        $('#KLMCclaimStatus').text('No Data')
        $('#KLMCclaimNumber').text('No Data')
        $('#KLMCappNumber').text('No Data')
        $('#KLMCcreatedAt').text('No Data')
        $('#KLMCprodName').text('No Data')
        $('#KLMCclaimDetailLink').hide();
      }
      blurClaimConvDiv(true);
    })
}

function searchCustomer () {
  $('.progress-bar').css('width', '50%');
  var idSelector = $('#idSelector').val();
  var paramsInput = $('#paramsInput').val();
  if (paramsInput == '') {
    $('#paramsInput').attr('data-content', 'Please fill out this field!');
    $('#paramsInput').popover('show');
    return;
  }
  searchMode(false);
  let ppHeader = generatePPHeader(contentMd5, contentType, partnerKey, selectedKey, path);
  
  let paramsName = generateParamsName(idSelector);
  
  let ppCustomerCall = {
    url: `${selectedEnv}${path}?${paramsName}=${paramsInput}`,
    type: 'GET',
    headers: ppHeader,
  };
  
  $('.progress-bar').css('width', '70%');

  client.request(ppCustomerCall).then(function(ppResponse) {
    $('.progress-bar').css('width', '90%');
    // console.log(ppResponse)
    if (ppResponse.data.users.length == 0 && ppResponse.data.policies.length == 0 
      && ppResponse.data.claims.length == 0) {
        client.invoke('notify', 'Data not found', 'alert')
        searchMode(true);
        return;
      }
    searchMode(true);
    if (paramsName == 'policy_number' || paramsName == 'app_number') {
      $('#profileDiv').hide();
      $('#policyDiv').show();
      // $('#claimDiv').hide();
      // $('#claimDiv').css('margin-top', '')
    } else if (paramsName == 'claim_number') {
      $('#profileDiv').hide();
      $('#policyDiv').hide();
      // $('#claimDiv').show();
      // $('#claimDiv').css('margin-top', '-21px')
    } else {
      $('#userName').text(ppResponse.data.users[0].name)
      $('#userPhone').text(ppResponse.data.users[0].phone_number)
      $('#userEmail').text(ppResponse.data.users[0].email_id)
      $('#profileDiv').show();
      $('#policyDiv').show();
      // $('#claimDiv').show();
      // $('#claimDiv').css('margin-top', '')
    }

    client.invoke('resize', { width: '100%', height: '500px' });
    policiesList = ppResponse.data.policies;
    claimsList = ppResponse.data.claims;
  
    populatePolicies(ppResponse.data.policies)
    populateClaims(ppResponse.data.claims)
  }).catch((error) => {
    searchMode(true);
    console.log(error)
  });
}

function popModal(html){
  client.invoke('instances.create', {
    location: 'modal',
    url: 'assets/new_modal.html?parent_guid=' + parentGuid,
    size: {
      width: '70vw',
	    height: '60vh'
    }
  }).then(function(modalContext) {
    var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);
    client.on(`modalReady${ticketId}`, function() {
      modalClient.trigger('drawData', html);
    });
  });
};

function handleClaimChange (claimId) {
  if (channelSource == 'tanya_pasar_polis') {
    blurClaimConvDiv(false);
    getClaimTanya(claimId)
  }
}

function generateSignString (contentMd5, contentType, date, path) {
  return 'GET' + '\n' + contentMd5 + '\n' + contentType + '\n' + date + '\n' + path;
}

function populatePolicies (policies) {
  if (policies.length > 0) {
    $('#POLappNumber').text((policies[0].application_number === '') ? '...' : policies[0].application_number)
    $('#POLappStatus').text((policies[0].application_status === '') ? '...' : policies[0].application_status)
    $('#POLpolNumber').text((policies[0].policy_number === '') ? '...' : policies[0].policy_number)
    $('#POLprodName').text((policies[0].product_name === '') ? '...': policies[0].product_name)
    $('#POLcreatedAt').text(policies[0].created_at)
    $('#POLpolStartDate').text(policies[0].policy_start_date)
    $('#POLpolDetailLink').prop('href', policies[0].details_link)
    $('#POLpolDetailLink').show()
    $('#showAllPolicies').text(`Number of Policies: ${policies.length}`)
    $('#showAllPolicies').prop('href', 'javascript:showAllPolicies()')
  } else {
    $('#POLappNumber').text('No Data')
    $('#POLappStatus').text('No Data')
    $('#POLpolNumber').text('No Data')
    $('#POLprodName').text('No Data')
    $('#POLcreatedAt').text('No Data')
    $('#POLpolStartDate').text('No Data')
    $('#POLpolDetailLink').prop('href', '#')
    $('#POLpolDetailLink').hide()
    $('#showAllPolicies').text(`Number of Policies: ${policies.length}`)
    $('#showAllPolicies').prop('href', '#')
  }
}

function populateClaims (claims) {
  if (claims.length > 0) {
    // $('#KLMclaimId').text(claims[0].claim_id)
    $('#KLMclaimStatus').text(claims[0].claim_status)
    $('#KLMclaimNumber').text(claims[0].claim_number)
    $('#KLMappNumber').text(claims[0].application_number)
    $('#KLMcreatedAt').text(claims[0].created_at)
    $('#KLMprodName').text(claims[0].product_name)
    $('#KLMclaimDetailLink').prop('href', claims[0].details_link)
    $('#KLMclaimDetailLink').show()
    $('#showAllClaims').text(`Number of Claims: ${claims.length}`)
    $('#showAllClaims').prop('href', 'javascript:showAllClaims()')
  } else {
    // $('#KLMclaimId').text('No Data')
    $('#KLMclaimStatus').text('No Data')
    $('#KLMclaimNumber').text('No Data')
    $('#KLMappNumber').text('No Data')
    $('#KLMcreatedAt').text('No Data')
    $('#KLMprodName').text('No Data')
    $('#KLMclaimDetailLink').prop('href', '#')
    $('#KLMclaimDetailLink').hide()
    $('#showAllClaims').text(`Number of Claims: ${claims.length}`)
    $('#showAllClaims').prop('href', '#')
  }
}

function blurClaimConvDiv (finish) {
  if (finish) {
    $('#claimDivTanya').css('filter', '');
    $('#claimDivTanya .progress').hide();
  } else {
    $('#claimDivTanya').css('filter', 'blur(1px)');
    $('#claimDivTanya .progress').show();
  }
}

function blurProfileDiv (finish) {
  if (finish) {
    $('#profileDiv').css('filter', '');
    $('#profileDiv .progress').hide();
  } else {
    $('#profileDiv').css('filter', 'blur(1px)');
    $('#profileDiv .progress').show();
  }
}

function blurPolicyDiv (finish) {
  if (finish) {
    $('#policyDiv').css('filter', '');
    $('#policyDiv .progress').hide();
  } else {
    $('#policyDiv').css('filter', 'blur(1px)');
    $('#policyDiv .progress').show();
  }
}

// function blurClaimsDiv (finish) {
//   if (finish) {
//     $('#claimDiv').css('filter', '');
//     $('#claimDiv .progress').hide();
//   } else {
//     $('#claimDiv').css('filter', 'blur(1px)');
//     $('#claimDiv .progress').show();
//   }
// }

function progressMode () {
  $('#profileDiv .progress').hide();
}

function searchMode (done) {

  let profileVisible = $('#profileDiv').is(":visible");
  let policyVisible = $('#policyDiv').is(":visible");
  // let claimVisible = $('#claimDiv').is(":visible");

  if (!done) {
    if (!profileVisible && !policyVisible) {
      $('#progressBar').show();
    } else {
      blurProfileDiv(false);
      blurPolicyDiv(false);
      // blurClaimsDiv(false);
    }
    $('#searchBtn').prop('disabled', true);
    $('#searchBtn').css('cursor', 'progress');
  } else {
    blurProfileDiv(true);
    blurPolicyDiv(true);
    // blurClaimsDiv(true);

    $('#searchBtn').prop('disabled', false);
    $('#searchBtn').css('cursor', 'auto');
    $('#progressBar').hide();
  }
}

function paramsChange (selector) {
  var idSelector = $(selector).val();
  switch (idSelector) {
    case 'email':
      $('#paramsInput').attr('data-content', 'eg: customer@example.com');
      break;
    case 'phone':
      $('#paramsInput').attr('data-content', 'eg: 62-999222111');
      break;
    case 'claim':
      $('#paramsInput').attr('data-content', 'eg: KLM-1122333');
      break;
    case 'policy':
      $('#paramsInput').attr('data-content', 'eg: APP-1122333');
      break;
    case 'app':
      $('#paramsInput').attr('data-content', 'eg: DR-11122333');
      break;
    default:
      $('#paramsInput').attr('data-content', 'eg: customer@example.com');
      break;
  }
}

function showAllClaims () {
  popModal(claimsList)
}

function showAllPolicies () {
  popModal(policiesList)
}

function getBigger () {
  client.invoke('resize', { width: '100%', height: '500px' });
}

// function envChange (selection) {
//   resetEnv($(selection).val());
// }

// function resetEnv (env) {
//   switch (env) {
//     case 'production': 
//       selectedEnv = prodHost;
//       selectedKey = prodKey;
//       break;
//     case 'testing':
//       selectedEnv = testingHost;
//       selectedKey = testingKey;
//       break;
//     case 'sandbox': 
//       selectedEnv = sandboxHost;
//       selectedKey = sandboxKey;
//       break;
//     default:
//       selectedEnv = prodHost;
//       selectedKey = prodKey;
//   }
// }

function generateParamsName (idSelector) {
  var paramsName = '';
  switch (idSelector) {
    case 'email':
      paramsName = 'email';
      break;
    case 'phone':
      paramsName = 'phone_number';
      break;
    case 'claim':
      paramsName = 'claim_number';
      break;
    case 'policy':
      paramsName = 'policy_number';
      break;
    case 'app':
      paramsName = 'app_number';
      break;
    default:
      paramsName = 'email';
      break;
  }
  return paramsName;
}

function generatePPHeader (contentMd5, contentType, partnerCode, secretKey, path, ) {
  let md5Hex = CryptoJS.MD5(contentMd5).toString(CryptoJS.enc.Hex)
  let date = new Date().toUTCString();

  let signedString = generateSignString(md5Hex, contentType, date, path)
  let signature64 = CryptoJS.HmacSHA256(signedString, secretKey).toString(CryptoJS.enc.Base64);
  let finalSignature = buffer.Buffer.from(partnerCode + ':' + signature64).toString('base64')

  return { 'Signature': finalSignature,
          'X_PATH': path,
          'X-PP-Date': date,
          'Content-MD5': md5Hex,
          'Content-Type': contentType,
          'Partner-Code': partnerCode }
}