import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { calendarForRequest, apiError } from '@/lib/google';

export async function POST(req:NextRequest) {
  try {
    const { message, events=[] } = await req.json();
    if (!message?.trim()) return Response.json({error:'Write a request first.'},{status:400});
    // Verify Google auth even when the optional AI key is not configured.
    await calendarForRequest(req);
    if (process.env.OPENAI_API_KEY) {
      const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
      const completion=await client.chat.completions.create({model:process.env.OPENAI_MODEL || 'gpt-4o-mini',temperature:0.2,
        messages:[
          {role:'system',content:'You are an AI-native business calendar assistant. Use the supplied calendar events as context. Be concise and practical. Do not claim to create, move, or delete events; this endpoint only gives advice. If asked for a meeting slot, suggest options that do not overlap the provided events. Current date: '+new Date().toISOString()},
          {role:'user',content:`Calendar events (ISO times): ${JSON.stringify(events.slice(0,100))}\n\nRequest: ${message}`}
        ]});
      return Response.json({reply:completion.choices[0]?.message?.content || 'I could not generate a suggestion.'});
    }
    return Response.json({reply:localPlan(message,events)});
  } catch(e){return apiError(e);}
}
function localPlan(message:string, events:any[]) {
  const text=message.toLowerCase();
  const todays=events.filter(e=>{const d=e.start?.dateTime||e.start?.date;return d && new Date(d).toDateString()===new Date().toDateString();});
  if(text.includes('busy')||text.includes('schedule')||text.includes('today')) {
    if(!todays.length) return 'Your calendar looks clear today based on the events loaded. Consider protecting a focus block and adding a buffer before important meetings.';
    const names=todays.map(e=>`${new Date(e.start?.dateTime||e.start?.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} — ${e.summary||'Untitled event'}`).join('\n');
    return `Here is your schedule for today:\n${names}\n\nAI tip: add 10–15 minutes of buffer around high-context meetings and reserve one uninterrupted focus block.`;
  }
  if(text.includes('focus')||text.includes('deep work')) return 'Protect a 60–90 minute focus block during your longest open window. Put it on the calendar as “Focus time”, mute non-urgent notifications, and avoid placing it directly after a meeting.';
  if(text.includes('meeting')||text.includes('slot')||text.includes('free')) return 'For a meeting, first check your calendar for overlapping events and leave a 10-minute buffer. The prototype can suggest a slot, but use the event form to confirm and create it.';
  return 'I can help review your day, suggest focus time, identify meeting conflicts, and prepare a more balanced schedule. Try asking “How busy am I today?” or “Help me protect focus time.” Add OPENAI_API_KEY to enable richer natural-language planning.';
}
