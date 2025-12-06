import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * 询价API路由
 * 处理询价表单提交，通过公司邮箱发送邮件
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, phone, email, service, message } = body

    // 验证必填字段
    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, message: '请填写必填字段（姓名、电话、邮箱）' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 获取环境变量 - 支持公司邮箱SMTP配置
    const smtpHost = process.env.SMTP_HOST || 'smtp.qiye.aliyun.com' // SMTP服务器地址
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10) // SMTP端口，默认587
    const smtpSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465' // 是否使用SSL/TLS
    const smtpUser = process.env.SMTP_USER || process.env.COMPANY_EMAIL || 'yyservice@yymarines.com' // 发件人邮箱
    const smtpPassword = process.env.SMTP_PASSWORD || process.env.COMPANY_EMAIL_PASSWORD || 'P!9kL2s@4dF7gR%' // 邮箱密码或授权码
    const recipientEmail = process.env.RECIPIENT_EMAIL || smtpUser || 'yyservice@yymarines.com' // 接收询价的邮箱，默认使用发送邮箱

    if (!smtpUser || !smtpPassword) {
      console.error('公司邮箱配置缺失')
      return NextResponse.json(
        { success: false, message: '服务器配置错误，请联系管理员' },
        { status: 500 }
      )
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // 465端口使用true，587端口使用false
      auth: {
        user: smtpUser,
        pass: smtpPassword
      },
      // 如果使用587端口，需要启用STARTTLS
      ...(smtpPort === 587 && !smtpSecure && {
        requireTLS: true
      })
    })

    // 服务类型映射
    const serviceMap: Record<string, string> = {
      engineering: '船舶工程服务',
      supply: '船舶设备供应',
      maintenance: '船舶维修保养',
      consulting: '船舶技术咨询',
      inspection: '船舶检验认证',
      crew: '船员派遣管理',
      sale: '普通货船买卖'
    }

    const serviceName = service ? serviceMap[service] || service : '未指定'

    // 邮件内容
    const mailOptions = {
      from: `"贻洋船舶服务" <${smtpUser}>`,
      to: recipientEmail,
      subject: `【网站询价】来自 ${name} 的询价信息`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">新询价通知</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">客户信息</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">姓名：</td>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              ${company ? `
              <tr>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee; font-weight: bold;">公司名称：</td>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee;">${company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee; font-weight: bold;">联系电话：</td>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee;">
                  <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee; font-weight: bold;">电子邮箱：</td>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee; font-weight: bold;">感兴趣的服务：</td>
                <td style="padding: 8px; background: white; border-bottom: 1px solid #eee;">${serviceName}</td>
              </tr>
            </table>
          </div>
          
          ${message ? `
          <div style="background: white; padding: 20px; margin-top: 20px; border-left: 4px solid #764ba2;">
            <h3 style="color: #764ba2; margin-top: 0;">详细需求</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
          </div>
          ` : ''}
          
          <div style="background: #e8f4f8; padding: 15px; margin-top: 20px; border-radius: 4px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">此邮件由网站询价表单自动发送，请及时回复客户。</p>
            <p style="margin: 5px 0 0 0;">发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
          </div>
        </div>
      `,
      // 纯文本版本（备用）
      text: `
新询价通知

客户信息：
姓名：${name}
${company ? `公司名称：${company}\n` : ''}联系电话：${phone}
电子邮箱：${email}
感兴趣的服务：${serviceName}
${message ? `\n详细需求：\n${message}` : ''}

发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
      `.trim()
    }

    // 发送邮件
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: '询价信息已成功发送，我们会尽快与您联系！'
    })
  } catch (error) {
    console.error('发送邮件失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '发送失败，请稍后重试或直接联系我们'
      },
      { status: 500 }
    )
  }
}

