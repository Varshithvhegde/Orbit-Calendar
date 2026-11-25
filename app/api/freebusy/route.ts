import { NextRequest } from 'next/server';
import { calendarForRequest, apiError } from '@/lib/google';
export async function POST(req:NextRequest) {
  try { const body=await req.json(); const calendar=await calendarForRequest(req);
    const result=await calendar.freebusy.query({requestBody:{timeMin:body.start,timeMax:body.end,items:[{id:'primary'}]}});
    return Response.json({busy:result.data.calendars?.primary?.busy || []});
  } catch(e){return apiError(e);}
}
