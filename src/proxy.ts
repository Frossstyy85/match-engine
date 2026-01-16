import {NextRequest, NextResponse} from "next/server";

export default function proxy(request: NextRequest){
    NextResponse.next();
}

