import { supabase, configured } from "./supabase-client.js";

if(configured){
  const original = document.getElementById("submitRequest");
  if(original){
    original.addEventListener("click", async (e)=>{
      // Existing booking.js still builds local demo data first. Live insert follows.
      if(!document.getElementById("agree")?.checked) return;
      try{
        const artistName = document.querySelector(".artist-choice.selected strong")?.textContent?.trim();
        if(!artistName) return;
        const {data:artistRows,error:artistErr}=await supabase.from("artists").select("id").eq("name",artistName).limit(1);
        if(artistErr) throw artistErr;
        const artist_id=artistRows?.[0]?.id;
        if(!artist_id) throw new Error("Artist account not found in database.");

        const summaryText=document.getElementById("summary")?.innerText||"";
        const reqs=JSON.parse(localStorage.getItem("poa_requests")||"[]");
        const last=reqs[reqs.length-1];
        if(!last) return;

        // Build local datetime from requested date/time.
        function to24(t){
          const m=t.match(/(\d+):(\d+)\s(AM|PM)/);let h=+m[1],min=+m[2];
          if(m[3]==="PM"&&h!==12)h+=12;if(m[3]==="AM"&&h===12)h=0;
          return `${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}:00`;
        }
        const start=new Date(`${last.date}T${to24(last.time)}`);
        const end=last.duration?new Date(start.getTime()+last.duration*60000):null;

        const payload={
          status:"pending",
          client_name:last.client,
          date_of_birth:document.getElementById("dob")?.value||null,
          email:last.email,
          phone:last.phone,
          placement:document.getElementById("placement")?.value||"",
          description:last.description||"",
          artist_id,
          service:last.service,
          size_option:last.size||null,
          tattoo_count:last.count||1,
          requested_start:start.toISOString(),
          requested_end:end?end.toISOString():null,
          duration_minutes:last.duration||null,
          deposit_due:last.deposit_due||0,
          deposit_paid:0,
          total_price:last.total??null,
          price_is_starting:Boolean(document.getElementById("summary")?.innerText.includes("+"))
        };
        const {data:booking,error}=await supabase.from("bookings").insert(payload).select().single();
        if(error) throw error;

        // Upload reference images to private booking-references bucket.
        const files=[...(document.getElementById("refs")?.files||[])];
        for(const file of files){
          const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
          const storagePath=`${booking.id}/${crypto.randomUUID()}-${safe}`;
          const {error:upErr}=await supabase.storage.from("booking-references").upload(storagePath,file,{contentType:file.type});
          if(upErr) throw upErr;
          const {error:fileErr}=await supabase.from("booking_files").insert({booking_id:booking.id,storage_path:storagePath,original_name:file.name});
          if(fileErr) throw fileErr;
        }

        document.getElementById("message").innerHTML='<div class="notice good">Your request was sent to Place of Art and is now PENDING. The studio will review the requested date and time before confirming it.</div>';
      }catch(err){
        console.error(err);
        document.getElementById("message").innerHTML=`<div class="notice bad">The request could not be sent live: ${String(err.message||err)}</div>`;
      }
    }, {capture:false});
  }
}
