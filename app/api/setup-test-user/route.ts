import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10); 

    const user = await prisma.nguoiDung.create({
      data: {
        ho_va_ten: "Thợ Ảnh Test",
        email: "thoanh@gmail.com",
        mat_khau_hash: hashedPassword, 
        nen_tang_xac_thuc: "LOCAL",
        vai_tro: "THO_ANH",
      },
    });

    return NextResponse.json({ 
      message: "Đã tạo xong user test thành công! Hằng qua trang /login test được rồi nhé.", 
      user 
    });
    
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ 
         message: "Tài khoản thoanh@gmail.com này đã có sẵn trong Database rồi, Hằng cứ mở trang /login lên mà test luôn!" 
       });
    }
    
    return NextResponse.json({ 
      message: "Có lỗi xảy ra khi gọi Database", 
      error: error.message 
    }, { status: 500 });
  }
}