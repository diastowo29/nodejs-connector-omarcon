
$(document).ready(function () {
    const params = new URLSearchParams(window.location.search)
    let parentGuid = params.get('parent_guid');
    var client = ZAFClient.init();
    var listTable = $('#example').DataTable({
        scrollY: '80vh',
        scrollCollapse: true,
        searching: false,
        lengthChange: false,
        ordering: false,
        pageLength: 5
    });


    client.on('app.registered', function(){
        var ticketId = '';
        var ticketClientPromise = client.get('instances').then(function(instancesData) {
            var instances = instancesData.instances;
            for (var instanceGuid in instances) {
                if (instances[instanceGuid].instanceGuid == parentGuid) {
                    ticketId = instances[instanceGuid].ticketId;
                    return client.instance(instanceGuid);
                }
            }
        });
    
        ticketClientPromise.then(function(ticketClient) {
            ticketClient.trigger(`modalReady${ticketId}`);
        });
    });
    
    client.on('drawData', populateData);
    
    function populateData(jsonData) {
        if ('claim_number' in jsonData[0]) {
            $('.tableFirstCol').html('List of Active Claims')
            jsonData.forEach(claim => {
                listTable.row.add([
                    clmColGen(claim.claim_number, claim.claim_status, claim.application_number,
                        claim.product_name, claim.created_at),
                    // detailColGen(claim.details_link)
                ]).draw(false);
            });
        } else {
            $('.tableFirstCol').html('List of Active Transactions')
            jsonData.forEach(policy => {
                listTable.row.add([
                    polColGen(policy.application_number, policy.application_status, 
                        policy.policy_number, policy.product_name,
                        policy.created_at, policy.policy_start_date),
                    // detailColGen(policy.details_link)
                ]).draw(false);
            });
        }
    };
});

function polColGen (appNumber, appStatus, polNumber, prodName, createdDate, polStartDate) {
    var badge;
    switch (appStatus) {
        case 'Completed':
            badge = 'badge-success';
            break;
        case 'Canceled':
            badge = 'badge-danger';
            break;
        case 'Pending':
            badge = 'badge-info';
            break;
        default:
            badge = 'badge-success';
            break;
    }
    return `<div class="card-group">
        <div class="card border-light">
            <div class="card-body">
                <h7>Transaction Number</h7>
                <h6 class="card-title">${appNumber}</h6>
                <h7>Payment Status</h7>
                <h6 class="card-title"><span class="badge ${badge}">${appStatus}</span></h6>
            </div>
        </div>
        <div class="card border-light">
            <div class="card-body">
                <h7>Insurance Policy Number</h7>
                <h6 class="card-title">${polNumber}</h6>
                <h7>Product Name</h7>
                <h6 class="card-title">${prodName}</h6>
            </div>
        </div>
        <div class="card border-light">
            <div class="card-body">
                <h7>Created At</h7>
                <h6 class="card-title">${createdDate}</h6>
                <h7>Policy Start Date</h7>
                <h6 class="card-title">${polStartDate}</h6>
            </div>
        </div>
        <div class="card border-light">
            <div class="card-body">
                <h7>Payment Method</h7>
                <h6 class="card-title">Gopay</h6>
                <h7>Policy Start Date</h7>
                <h6 class="card-title">${polStartDate}</h6>
            </div>
        </div>
    </div>`;
}

function clmColGen (clmNumber, clmStatus, appNumber, prodName, createdDate) {
    var badge;
    switch (clmStatus) {
        case 'Completed':
            badge = 'badge-success';
            break;
        case 'Rejected':
            badge = 'badge-danger';
            break;
        default:
            badge = 'badge-success';
            break;
    }
    return `<div class="card-group">
        <div class="card border-light">
            <div class="card-body">
                <h7>Claim Number</h7>
                <h6 class="card-title">${clmNumber}</h6>
                <h7>Claim Status</h7>
                <h6 class="card-title"><span class="badge ${badge}">${clmStatus}</span></h6>
            </div>
        </div>
        <div class="card border-light">
            <div class="card-body">
                <h7>Application Number</h7>
                <h6 class="card-title">${appNumber}</h6>
                <h7>Product Name</h7>
                <h6 class="card-title">${prodName}</h6>
            </div>
        </div>
        <div class="card border-light">
            <div class="card-body">
                <h7>Created At</h7>
                <h6 class="card-title">${createdDate}</h6>
            </div>
        </div>
    </div>`;
}


function detailColGen (detailLink) {
    return `<a href="${detailLink}" target="_blank" class="btn btn-primary">Details</a>`
}
