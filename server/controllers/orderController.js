const Order = require("../model/Order");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const createOrder = async (req, res) => {
  try {
    const { shipping, items, subtotal, discount, delivery, total } = req.body;

    const order = await Order.create({
      user: req.user.id,
      shipping,
      items,
      subtotal,
      discount,
      delivery,
      total,
      paymentStatus: "Pending",
      orderStatus: "Delivered",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "items.book",
        populate: {
          path: "author",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.log("Get My Orders Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.book",
      populate: {
        path: "author",
        select: "name",
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8"/>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,Helvetica,sans-serif;
}

body{
padding:35px;
font-size:13px;
color:#333;
background:#fff;
}

.header{
display:flex;
justify-content:space-between;
align-items:center;
padding-bottom:20px;
border-bottom:3px solid #0f766e;
margin-bottom:25px;
}

.logo{
font-size:32px;
font-weight:bold;
color:#0f766e;
}

.company{
text-align:right;
}

.company h2{
color:#0f766e;
margin-bottom:5px;
}

.invoice-title{
margin-top:15px;
font-size:30px;
font-weight:bold;
color:#111827;
}

.info{
display:flex;
justify-content:space-between;
margin-top:25px;
}

.box{
width:48%;
border:1px solid #ddd;
padding:15px;
border-radius:8px;
}

.box h3{
margin-bottom:10px;
color:#0f766e;
}

.details{
margin-top:25px;
}

.details table{
width:100%;
border-collapse:collapse;
}

.details th{
background:#0f766e;
color:white;
padding:10px;
font-size:13px;
}

.details td{
padding:10px;
border:1px solid #ddd;
}

.details tr:nth-child(even){
background:#f8f8f8;
}

.summary{
margin-top:25px;
width:320px;
margin-left:auto;
}

.summary table{
width:100%;
border-collapse:collapse;
}

.summary td{
padding:8px;
}

.summary tr:last-child{
font-size:17px;
font-weight:bold;
border-top:2px solid #111;
}

.footer{
margin-top:60px;
border-top:1px solid #ddd;
padding-top:20px;
display:flex;
justify-content:space-between;
align-items:flex-end;
}

.signature{
text-align:center;
}

.thanks{
margin-top:15px;
text-align:center;
font-size:14px;
color:#555;
}

</style>

</head>

<body>

<div class="header">

<div>

<div class="logo">
MyBookStore
</div>

<div style="margin-top:8px">
Professional Book Store
</div>

</div>

<div class="company">

<h2>INVOICE</h2>

<p><b>Invoice No:</b> INV-${order._id.toString().slice(-6)}</p>

<p><b>Order ID:</b> ${order._id}</p>

<p><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString()}</p>

<p><b>Payment:</b> ${order.paymentStatus}</p>

<p><b>Method:</b> ${order.paymentMethod}</p>

</div>

</div>

<div class="info">

<div class="box">

<h3>Billing Address</h3>

<p><b>${order.shipping.fullName}</b></p>

<p>${order.shipping.phone}</p>

<p>${order.shipping.address}</p>

<p>${order.shipping.city}</p>

<p>${order.shipping.state}</p>

<p>${order.shipping.pincode}</p>

</div>

<div class="box">

<h3>Shipping Address</h3>

<p><b>${order.shipping.fullName}</b></p>

<p>${order.shipping.phone}</p>

<p>${order.shipping.address}</p>

<p>${order.shipping.city}</p>

<p>${order.shipping.state}</p>

<p>${order.shipping.pincode}</p>

</div>

</div>

<div class="details">

<table>

<thead>

<tr>

<th>Book</th>

<th>Author</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${order.items
  .map(
    (item) => `
<tr>

<td>${item.book.name}</td>

<td>${item.book.author.map((a) => a.name).join(", ")}</td>

<td>${item.quantity}</td>

<td>₹${item.price}</td>

<td>₹${item.price * item.quantity}</td>

</tr>
`,
  )
  .join("")}

</tbody>

</table>

</div>

<div class="summary">

<table>

<tr>

<td>Subtotal</td>

<td align="right">₹${order.subtotal}</td>

</tr>

<tr>

<td>Discount</td>

<td align="right">₹${order.discount}</td>

</tr>

<tr>

<td>Shipping</td>

<td align="right">${order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</td>

</tr>

<tr>

<td>Grand Total</td>

<td align="right">₹${order.total}</td>

</tr>

</table>

</div>

<div class="thanks">

Thank you for shopping with <b>MyBookStore</b>

</div>

<div class="footer">

<div>

<b>Terms & Conditions</b>

<p style="margin-top:8px;font-size:12px">

• Goods once sold are not returnable.<br>

• Keep this invoice for warranty purposes.<br>

• This is a computer generated invoice.

</p>

</div>

<div class="signature">

<p>Authorized Signature</p>

<br><br>

____________________

</div>

</div>

</body>

</html>
`;

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order._id}.pdf`,
    });

    res.send(pdf);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createOrder, getMyOrders, downloadInvoice };
