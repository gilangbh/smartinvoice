App = {
  web3Provider: null,
  contracts: {},
  invoices: [],

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC.
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SmartInvoice2.json',function(data) {
      var invoiceArtifact = data;
      App.contracts.SmartInvoice2 = TruffleContract(invoiceArtifact);

      App.contracts.SmartInvoice2.setProvider(App.web3Provider);

      return App.getSuppliers();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-sell', App.sellInvoice);
    $(document).on('click', '.btn-applyrating', App.applyrating);
  },

  sellInvoice: function() {
    event.preventDefault();

    var invoiceId = parseInt($(event.target).data('id'));
    var invoiceInstance;

    bootbox.prompt("Please input the new address", function(result){

      var newBuyer = result;

      web3.eth.getAccounts(function(error,accounts){
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        App.contracts.SmartInvoice2.deployed().then(function(instance) {
          invoiceInstance = instance;

          return invoiceInstance.sell(invoiceId, newBuyer, {from: account});

        }).then(function(result) {
          console.log(result);
          return App.getSuppliers();
        }).catch(function(err) {
        console.log(err.message);
        });
      });
    });
  },

  applyrating: function() {
    event.preventDefault();

    var invoiceId = parseInt($(event.target).data('id'));
    var invoiceInstance;

    bootbox.prompt("Please input the new rating", function(result){

      var newRating = result;

      web3.eth.getAccounts(function(error,accounts){
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        App.contracts.SmartInvoice2.deployed().then(function(instance) {
          invoiceInstance = instance;

          return invoiceInstance.applyRating(invoiceId,newRating);

        }).then(function(result) {
          console.log(result);
          return App.getSuppliers();
        }).catch(function(err) {
          console.log(err.message);
        });
      });
    });
  },

  getSuppliers: function(suppliers, account) {
    var smartInvoiceInstance;
    invoices = [];

    App.contracts.SmartInvoice2.deployed().then(function(instance) {
      smartInvoiceInstance = instance;

      return smartInvoiceInstance.getSuppliers.call();
    }).then(function(suppliers) {
        var invoiceRow = $('#invoiceRow');
        var invoiceTemplate = $('#invoiceTemplate');

      for (i = 0; i < suppliers.length; i++) {
        var item = suppliers[i];
        invoices.push({"supplier":item,"buyer":0,"rating":0});

        invoices[i].supplier = suppliers[i];
        invoiceTemplate.find('.invoice-supplier').text(suppliers[i]);
        invoiceTemplate.find('.invoice-id').text(i);
      }
      return App.getBuyers();
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  
  getBuyers: function(buyers, account) {
    var smartInvoiceInstance;
    
    App.contracts.SmartInvoice2.deployed().then(function(instance) {
      smartInvoiceInstance = instance;

      return smartInvoiceInstance.getBuyers.call();
    }).then(function(buyers) {
        var invoiceRow = $('#invoiceRow');
        var invoiceTemplate = $('#invoiceTemplate');

      for (i = 0; i < buyers.length; i++) {
        var item = buyers[i];
        invoices[i].buyer = item;

        invoiceTemplate.find('.invoice-buyer').text(buyers[i]);
        invoiceTemplate.find('.invoice-id').text(i);
      }
      return App.getRatings();
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  
  getRatings: function(ratings, account) {
    var smartInvoiceInstance;

    App.contracts.SmartInvoice2.deployed().then(function(instance) {
      smartInvoiceInstance = instance;

      return smartInvoiceInstance.getRatings.call();
    }).then(function(ratings) {
        var invoiceRow = $('#invoiceRow');
        var invoiceTemplate = $('#invoiceTemplate');

      for (i = 0; i < ratings.length; i++) {
        var item = ratings[i];
        invoices[i].rating = item.c[0];

        invoiceTemplate.find('.invoice-riskrating').text(ratings[i]);
        invoiceTemplate.find('.invoice-id').text(i);
      }
      return App.fillInvoiceDetails(invoices);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  fillInvoiceDetails: function(invoices,account) {
    var invoiceRow = $('#invoiceRow');
    var invoiceTemplate = $('#invoiceTemplate');

    console.log(invoices);
    for (i = 0; i < invoices.length; i ++) {

      invoiceTemplate.find('.invoice-id').text(i);
      invoiceTemplate.find('.invoice-supplier').text(invoices[i].supplier);
      invoiceTemplate.find('.invoice-buyer').text(invoices[i].buyer);
      invoiceTemplate.find('.invoice-value').text(100000);
      invoiceTemplate.find('.invoice-duedate').text("31/12/2017");
      invoiceTemplate.find('.invoice-riskrating').text(invoices[i].rating);
      invoiceTemplate.find('.btn-applyrating').attr('data-id', i);
      invoiceTemplate.find('.btn-sell').attr('data-id', i);

      invoiceRow.append(invoiceTemplate.html());
    }    
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
