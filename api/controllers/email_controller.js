/**
 * Created by trungquandev.com's author on 18/02/2020.
 * utils/mailer.js
 */
 const nodeMailer = require('nodemailer')

 // Những thông tin dưới đây các bạn có thể ném nó vào biến môi trường env nhé.
 // Vì để demo nên mình để các biến const ở đây.
 const adminEmail = 'support@tool264.com'
 const adminPassword = '#@*7LRmrfNZcn*@)'
 // Mình sử dụng host của google - gmail
 const mailHost = 'smtp.tool264.com'
 // 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
 const mailPort = 587
 


 const sendMail = (to,key_active) => {
   // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
   const transporter = nodeMailer.createTransport({
     host: mailHost,
     port: mailPort,
     secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
     auth: {
       user: adminEmail,
       pass: adminPassword
     }
   })
 
   const options = {
     from: adminEmail, // địa chỉ admin email bạn dùng để gửi
     to: to, // địa chỉ gửi đến
     subject: subject, // Tiêu đề của mail
     html: `<h3>Chao mừng bạn đã đăng ký tool264.com</h3><div>Bấm vào link để kích hoạt tài khoản: </div><a target="_blank" href="https://tool264.com/account/activate/${key_active}">Kích hoạt</a>` // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
   }
 
   // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
   return transporter.sendMail(options)
 }

 const sendMail_recovery = (to,key_recovery) => {
  // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })

  const options = {
    from: adminEmail, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    html: `<h3>Chao mừng bạn đã đến tool264.com</h3><div>Bấm vào link để Thay đổi mật khẩu: </div><a target="_blank" href="https://tool264.com/recovery_save?key=${key_recovery}">Kích hoạt</a>` // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
  }
  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options)
}
 
 module.exports = {
   sendMail: sendMail,
   sendMail_recovery:sendMail_recovery
 }