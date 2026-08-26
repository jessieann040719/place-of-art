
document.getElementById("payOnline").addEventListener("click",()=>{
  const amount = Number(document.getElementById("giftAmount").value);
  const email = document.getElementById("buyerEmail").value.trim();
  if (!amount || amount < 25) return alert("Please enter a gift card amount of at least $25.");
  if (!email) return alert("Please enter your email address.");
  document.getElementById("giftMessage").innerHTML =
    '<div class="notice good">Gift card checkout is ready to connect. Once Stripe or Square is connected, this button will take the customer to secure payment. After payment, they will receive a confirmation and can pick up the physical voucher at the shop.</div>';
});
