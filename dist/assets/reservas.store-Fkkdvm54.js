import{A as c,d as n}from"./vue-vendor-B77bLtTV.js";import{s as t}from"./index-C3zR6LNs.js";const l={async getAll(){const{data:r,error:e}=await t.from("reservas_sesiones").select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        ),
        empleado:empleados (
          id,
          nombre
        )
      `).order("fecha_reserva",{ascending:!1});if(e)throw e;return r},async getByEmpleado(r){const{data:e,error:a}=await t.from("reservas_sesiones").select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        )
      `).eq("empleado_id",r).order("fecha_reserva",{ascending:!1});if(a)throw a;return e},async crear(r,e){const{data:a,error:i}=await t.from("sesiones").select("cupo_disponible").eq("id",e).single();if(i)throw i;if(a.cupo_disponible<=0)throw new Error("No hay cupo disponible para esta sesión");const{data:o,error:s}=await t.from("reservas_sesiones").insert([{sesion_id:e,empleado_id:r,estado:"confirmada"}]).select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        )
      `).single();if(s)throw s.code==="23505"?new Error("Ya tienes una reserva para esta sesión"):s;return o},async cancelar(r){const{data:e,error:a}=await t.from("reservas_sesiones").update({estado:"cancelada",fecha_cancelacion:new Date().toISOString()}).eq("id",r).select().single();if(a)throw a;return e},async marcarAsistencia(r,e){const a=e?"asistio":"no_asistio",{data:i,error:o}=await t.from("reservas_sesiones").update({estado:a}).eq("id",r).select().single();if(o)throw o;return i}},v=c("reservas",()=>{const r=n([]),e=n(!1);async function a(o){e.value=!0;try{r.value=await getMisReservasAPI(o)}catch(s){console.error("Error en el store al obtener reservas:",s)}finally{e.value=!1}}async function i(o){e.value=!0;try{const s=await l.create(o);return s.success&&r.value.push(s.reserva),s}catch(s){throw console.error("Error en el store al crear reserva:",s),s}finally{e.value=!1}}return{misReservas:r,isLoading:e,fetchMisReservas:a,crearReserva:i}});export{v as u};
