import { useState, useEffect } from 'react';
import { Calendar, Activity, Target, Award } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DashboardView = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    proximasSesiones: 0,
    puntosAcumulados: 0,
    desafiosActivos: 0,
    logrosObtenidos: 0
  });
  const [proximasSesiones, setProximasSesiones] = useState([]);
  const [desafiosActivos, setDesafiosActivos] = useState([]);
  const [ultimosLogros, setUltimosLogros] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar próximas sesiones
        const { data: sesiones, error: sesionesError } = await supabase
          .from('reservas')
          .select(`
            id,
            sesion:sesiones (
              id,
              titulo,
              fecha_inicio,
              fecha_fin,
              modalidad,
              usuarios:colaborador_id (
                nombre,
                apellido
              ),
              servicios (
                nombre,
                tipo
              )
            )
          `)
          .eq('usuario_id', user.id)
          .eq('estado', 'confirmada')
          .gte('sesion.fecha_inicio', new Date().toISOString())
          .order('sesion.fecha_inicio')
          .limit(5);

        if (sesionesError) throw sesionesError;

        // Cargar puntos acumulados
        const { data: perfil, error: perfilError } = await supabase
          .from('perfil_empleados')
          .select('puntos_bienestar')
          .eq('usuario_id', user.id)
          .single();

        if (perfilError) throw perfilError;

        // Cargar desafíos activos
        const { data: desafios, error: desafiosError } = await supabase
          .from('participacion_desafios')
          .select(`
            id,
            desafio:desafios_bienestar (
              id,
              titulo,
              descripcion,
              fecha_fin,
              puntos_completar
            )
          `)
          .eq('usuario_id', user.id)
          .in('estado', ['inscrito', 'en_progreso'])
          .order('desafio.fecha_fin')
          .limit(5);

        if (desafiosError) throw desafiosError;

        // Cargar últimos logros
        const { data: logros, error: logrosError } = await supabase
          .from('logros_usuario')
          .select(`
            id,
            fecha_obtencion,
            puntos_otorgados,
            logro:catalogo_logros (
              titulo,
              descripcion,
              categoria
            )
          `)
          .eq('usuario_id', user.id)
          .order('fecha_obtencion', { ascending: false })
          .limit(5);

        if (logrosError) throw logrosError;

        setStats({
          proximasSesiones: sesiones?.length || 0,
          puntosAcumulados: perfil?.puntos_bienestar || 0,
          desafiosActivos: desafios?.length || 0,
          logrosObtenidos: logros?.length || 0
        });

        setProximasSesiones(sesiones || []);
        setDesafiosActivos(desafios || []);
        setUltimosLogros(logros || []);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  if (error) {
    return (
      <Layout>
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Aquí tienes un resumen de tu bienestar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Próximas Sesiones"
            value={stats.proximasSesiones}
            icon={<Calendar className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Puntos Acumulados"
            value={stats.puntosAcumulados}
            icon={<Activity className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Desafíos Activos"
            value={stats.desafiosActivos}
            icon={<Target className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Logros Obtenidos"
            value={stats.logrosObtenidos}
            icon={<Award className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas Sesiones */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Próximas Sesiones
            </h2>
            <DataTable
              columns={[
                {
                  key: 'titulo',
                  header: 'Sesión',
                  render: (row) => row.sesion.titulo
                },
                {
                  key: 'fecha',
                  header: 'Fecha',
                  render: (row) => format(
                    new Date(row.sesion.fecha_inicio),
                    'PPp',
                    { locale: es }
                  )
                },
                {
                  key: 'colaborador',
                  header: 'Colaborador',
                  render: (row) => `${row.sesion.usuarios.nombre} ${row.sesion.usuarios.apellido}`
                }
              ]}
              data={proximasSesiones}
              searchable={false}
              pagination={false}
            />
          </div>

          {/* Desafíos Activos */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Desafíos Activos
            </h2>
            <DataTable
              columns={[
                {
                  key: 'titulo',
                  header: 'Desafío',
                  render: (row) => row.desafio.titulo
                },
                {
                  key: 'fecha_fin',
                  header: 'Finaliza',
                  render: (row) => format(
                    new Date(row.desafio.fecha_fin),
                    'PP',
                    { locale: es }
                  )
                },
                {
                  key: 'puntos',
                  header: 'Puntos',
                  render: (row) => row.desafio.puntos_completar
                }
              ]}
              data={desafiosActivos}
              searchable={false}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardView;