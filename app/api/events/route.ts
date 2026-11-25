import { NextRequest } from 'next/server';
import { calendarForRequest, apiError } from '@/lib/google';
export async function GET(req: NextRequest) {
  try {
    const calendar = await calendarForRequest(req);
    const start = req.nextUrl.searchParams.get('start') || new Date().toISOString();
    const end = req.nextUrl.searchParams.get('end') || new Date(Date.now()+7*86400000).toISOString();
    const result = await calendar.events.list({ calendarId:'primary', timeMin:start, timeMax:end, singleEvents:true, orderBy:'startTime', maxResults:250 });
    return Response.json({ events: result.data.items || [] });
  } catch (e) { return apiError(e); }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.summary || !body.start || !body.end) return Response.json({error:'Title, start and end are required.'},{status:400});
    const calendar = await calendarForRequest(req);
    const result = await calendar.events.insert({ calendarId:'primary', requestBody:{
      summary:body.summary, description:body.description || '', location:body.location || '',
      start:{dateTime:body.start, timeZone:body.timeZone || 'Asia/Kolkata'},
      end:{dateTime:body.end, timeZone:body.timeZone || 'Asia/Kolkata'},
      attendees: Array.isArray(body.attendees) ? body.attendees.map((email:string)=>({email})) : undefined
    } });
    return Response.json({event:result.data},{status:201});
  } catch(e) { return apiError(e); }
}
