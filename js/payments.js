var rewards = [
  { name: "test", description: "Test payment to see if the system works (thank you reward)", cost: 1},
  { name: "meal", description: "Lunch packed with superfoods", cost: 6},
  { name: "night", description: "Come and visit us", cost: 30 },
  { name: "week", description: "Why don't you stay for a week", cost: 180 },
  { name: "month", description: "Treat this as your second home", cost: 600 },
  { name: "investor", description: "Own 1% of the chapel", cost: 3000 },
];

var config = {
  stripe_pk: "pk_live_2DAE0pRgfhU4eH7NxiQ4jLbD",
  // stripe_pk: 'pk_test_gorhMMGRx3KOzCuhkkwX6iah',
  stripe_endpoint: "https://genesis-charge.herokuapp.com/charge",
  // stripe_endpoint: "http://localhost:3002/charge",
  stripe_name: "astralship.org",
  stripe_description: "pre-Kickstarter campaign",
  BTC: "17zVA88xk4Ma7Cza4NXGYcP4Z1Qz7TUdzV", // TODO: reliably generate QR code http://stackoverflow.com/questions/25339587/how-do-i-generate-a-qr-code-for-a-bitcoin-address-with-amount
  paypal_business: "email@genesis.re",
  currency: "GBP",
  reward: rewards[2],
};


// TODO: be international, accept more currencies
// TODO: get recent currency exchange rates via API
var currencies = [ 
  { symbol: "gbp", icon: "£", rate: 1.00 },
  // { symbol: "USD", icon: "$", rate: 0.80 }, 
  // { symbol: "EUR", icon: "€", rate: 0.85 }
];

var markupButt = "";
var markupDesc = "";
rewards.forEach(function(reward) {
  markupButt += "<a class='button' data-reward='" + reward.name + "'><strong>£" + reward.cost + "</strong> " + reward.name + "</div>"
  markupDesc += "<div class='description' data-reward='" + reward.name + "'>" + reward.description + "</div>"
});

$(".markupButt").html(markupButt);
$(".markupDesc").html(markupDesc);



$(".markupButt").on("click", "a", function() {
  var rewardName = $(this).data("reward");
  config.reward = rewards.filter(function(reward) { return reward.name === rewardName})[0];
  _selectReward(config.reward);
})

var _selectReward = function(reward) {
  var active = $(".markupDesc").find(".active")
  if (active.length > 0) {
    active.removeClass("active");
  }
  $(".markupDesc").find("[data-reward=" + reward.name + "]").addClass("active");

  
  var active = $(".markupButt").find(".special");
  if (active.length > 0) {
    active.removeClass("special");
  }
  $(".markupButt").find("[data-reward=" + reward.name + "]").addClass("special");

  // updating PayPal variables

  $("#paypal-business").val(config.paypal_business);
  $("#paypal-currency-code").val(config.currency);
  $("#paypal-item-name").val(config.reward.name + " in the chapel"); // TODO: make it more generic
  $("#paypal-amount").val(config.reward.cost);
};

_selectReward(config.reward); // TODO: maybe self-invoking anonymous function?


var stripePopup = StripeCheckout.configure({
  key: config.stripe_pk,
  image: 'images/logo/astralship-final-1-square-black-margin-120.png',
  locale: 'auto',
  token: function(token) { // Token is coming from the Stripe popup 
    console.log("Stripe token:", token);
    $('.payments').css({visibility: "hidden"});

    var data = {
      id : token.id,
      currency : config.currency,
      amount : config.reward.cost * 100,
    };

    $.post(config.stripe_endpoint, data, function(response) {
      console.log(response);
      $("#thankyou").show();
    }).fail(function(response) {
      console.error(response);
      $("#error").show();
      $("#exact-error").text(response.message);
    });
  }
});

$('#stripe-button').on('click', function(e) {
  // Open Checkout with further options
  stripePopup.open({
    name: config.stripe_name,
    description: config.stripe_description,
    currency: config.currency,
    amount: config.reward.cost * 100
  });
  e.preventDefault();
});

// Close Checkout on page navigation
$(window).on('popstate', function() {
  stripePopup.close();
});