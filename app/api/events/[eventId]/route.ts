import { NextRequest } from 'next/server';
import { calendarForRequest, apiError } from '@/lib/google';
type Context = { params: { eventId: string } };
export async function PATCH(req:NextRequest, {params}:Context) {
  try { const calendar=await calendarForRequest(req); const body=await req.json();
    const result=await calendar.events.patch({calendarId:'primary',eventId:params.eventId,requestBody:body});
    return Response.json({event:result.data});
  } catch(e){return apiError(e);}
}
export async function DELETE(req:NextRequest,{params}:Context) {
  try { const calendar=await calendarForRequest(req); await calendar.events.delete({calendarId:'primary',eventId:params.eventId}); return Response.json({ok:true}); }
  catch(e){return apiError(e);}
}
