    <template>
        <div>
            <template>
                <div class="q-pa-md">

                    <!-- FILTROS -->
                    <div class="row q-col-gutter-md">

                        <!-- AÑO -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="anioSeleccionado" :options="anios" label="PERIODO" option-label="anio"
                                option-value="id" emit-value map-options outlined dense :loading="anioSeleccionado" />
                        </div>

                        <!-- PERIORO 
                        <div class="col-12 col-md-2">
                            <q-select v-model="periodoSeleccionado" :options="periodos" label="PERIODO"
                                option-label="nombrePeriodo" option-value="id" emit-value map-options outlined dense
                                :loading="periodoSeleccionado" />
                        </div> -->

                        <!-- TIPO -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="tipoFicha" :options="tipos" label="TIPO" option-label="nombreTipo"
                                option-value="id" emit-value map-options outlined dense :loading="tipoFicha" />
                        </div>

                        <!-- UNIDAD -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="unidadSeleccionada" :options="unidades" label="UNIDAD"
                                option-label="nombreUnidad" option-value="idUnidad" emit-value map-options outlined
                                dense :loading="loadingUnidades" />
                        </div>

                        <!-- SERVICIO -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="servicioSeleccionado" :options="servicios" label="SERVICIO"
                                option-label="nombreServicio" option-value="idServicio" emit-value map-options outlined
                                dense :disable="!unidadSeleccionada" :loading="loadingServicios" />
                        </div>
                        <!-- CENTRO -->
                        <div class="col-12 col-md-4">
                            <q-input v-model="centroNombre" label="ESPACIO DE INTERVENCIÓN" outlined dense readonly
                                :disable="!unidadSeleccionada">
                                <template v-slot:append>

                                    <!-- BOTÓN LIMPIAR -->
                                    <q-btn v-if="centroSeleccionado" icon="close" flat round dense color="negative"
                                        @click="limpiarCentro" />

                                    <!-- BOTÓN BUSCAR -->
                                    <q-btn icon="search" flat round dense color="primary" @click="abrirDialogCentros"
                                        :disable="!unidadSeleccionada" />

                                </template>
                            </q-input>
                        </div>
                        <!-- ANEXO -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="anexoSeleccionado" :options="anexos" label="INSTRUMENTO"
                                :option-label="formatAnexoLabel" option-value="idAnexo" emit-value map-options outlined
                                dense :disable="!servicioSeleccionado" :loading="loadingAnexos" />
                        </div>

                    </div>



                </div>
            </template>

            <div class="row">
                <div class="col-12 q-gutter-sm text-right q-mt-sm q-mb-md">
                    <q-btn label="NUEVO" icon="add" class="btn-inabif" size="sm" @click="abrirDialog" />
                    <q-btn label="EXCEL" icon="download" color="green" class="btn-seccion-acciones" size="sm" />
                </div>
            </div>
            <!-- TABLA -->
            <div class="q-pa-md">
                <div class="col-12">

                    <q-table :data="dataTableAnexos" :columns="columnasTableAnexos" row-key="idAnexoCabecera"
                        table-header-class="bg-inabif text-bold" :rows-per-page-options="[10, 20, 50]"
                        :filter="filtroTabla" :loading="loadingTabla" dense flat bordered>
                        <!-- SLOT PARA ESTADO -->
                        <template v-slot:body-cell-estado="props">
                            <q-td align="center">

                                <q-btn :label="props.row.estado === 1 ? 'REGISTRADO' : 'ANULADO'"
                                    :color="props.row.estado === 1 ? 'positive' : 'negative'" outline dense size="sm"
                                    no-caps disable />

                            </q-td>
                        </template>
                        <!-- SLOT PARA BUSCADOR -->
                        <template v-slot:top-right>
                            <q-input dense outlined debounce="300" v-model="filtroTabla" placeholder="Buscar...">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:body-cell-acciones="scope">
                            <q-td align="center">
                                <q-btn-dropdown dropdown-icon="settings" class="q-mr-xs acciones" dense>
                                    <q-list style="min-width: 200px">
                                        <!-- Editar Evaluación -->
                                        <q-item clickable v-close-popup @click="editarRegistro(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="edit" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Editar Evaluación</q-item-section>
                                        </q-item>

                                        <!-- Eliminar Evaluación -->
                                        <q-item clickable v-close-popup @click="eliminarRegistro(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="delete" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Anular Evaluación</q-item-section>
                                        </q-item>
                                        <!-- Visualizar Evaluación -->
                                        <q-item clickable v-close-popup @click="verRegistro(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="visibility" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Ver Evaluación</q-item-section>
                                        </q-item>
                                        <!-- Visualizar Evaluación -->
                                        <q-item clickable v-close-popup @click="agregarAudio(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="mic" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Agregar Audio</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
                            </q-td>
                        </template>

                    </q-table>

                </div>
            </div>
            <q-dialog v-model="dialog" persistent @hide="resetModo">
                <q-card style="width: 60%; max-width: 60vw;">

                    <!-- HEADER -->
                    <q-card-section class="bg-inabif row items-center">
                        <div class="text-h6">
                            {{ tituloAnexo }}
                        </div>
                        <q-space />
                        <q-btn icon="close" flat dense round v-close-popup />
                    </q-card-section>

                    <!-- BODY -->
                    <q-card-section class="scroll" style="height: 80vh">

                        <q-card flat>

                            <q-card-section>
                                <div class="text-right"> <q-btn v-if="esVisualizacion" label="Descargar PDF"
                                        icon="picture_as_pdf" color="green" @click="descargarPDF" /></div>

                                <!-- ============================= -->
                                <!-- I. DATOS GENERALES (ACORDEÓN) -->
                                <!-- ============================= -->

                                <q-expansion-item label="I. DATOS GENERALES DEL SERVICIO" default-opened
                                    expand-separator header-class="bg-red-5 text-white q-mt-sm"
                                    expand-icon-class="text-white">

                                    <q-card-section class="q-pa-md">
                                        <q-markup-table bordered dense class="rounded-borders">
                                            <tbody>

                                                <tr v-if="mostrarModalidad">
                                                    <td class="text-left text-bold">
                                                        <q-icon name="person" class="q-mr-sm" />
                                                        MODALIDAD DE SUPERVISION
                                                    </td>
                                                    <td class="text-dark">
                                                        <q-select v-model="modoSupervision" :options="modalidades"
                                                            option-label="modo" option-value="id" emit-value map-options
                                                            outlined dense />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="account_tree" class="q-mr-sm" />
                                                        UNIDAD
                                                    </td>
                                                    <td class="text-dark">{{ form.nombreUnidad }}</td>
                                                </tr>

                                                <tr class="bg-grey-2">
                                                    <td class="text-left text-bold" style="width: 40%;">
                                                        <q-icon name="miscellaneous_services" class="q-mr-sm" />
                                                        SERVICIO
                                                    </td>
                                                    <td class="text-dark">{{ form.nombreServicio.toUpperCase() }}</td>
                                                </tr>


                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="location_city" class="q-mr-sm" />
                                                        CENTRO
                                                    </td>
                                                    <td class="text-dark">
                                                        {{ form.nombreCentro }}
                                                        <span v-if="form.tipoCentro" class="text-grey-7">
                                                            (PERFIL: {{ form.tipoCentro }})
                                                        </span>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="place" class="q-mr-sm" />
                                                        DEPARTAMENTO / PROVINCIA / DISTRITO
                                                    </td>
                                                    <td class="text-dark">{{ form.departamento }} / {{ form.provincia }}
                                                        / {{
                                                            form.distrito }}</td>
                                                </tr>

                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="person" class="q-mr-sm" />
                                                        RESPONSABLE SUPERVISIÓN
                                                    </td>
                                                    <td class="text-dark">
                                                        <q-select v-model="form.idRespSupervision"
                                                            :options="responsables" option-label="nombre"
                                                            option-value="idPersonal" emit-value map-options outlined
                                                            dense :disable="esVisualizacion" style="border: none;" />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="person" class="q-mr-sm" />
                                                        DIRECTOR/COORDINADOR
                                                    </td>
                                                    <td class="text-dark">
                                                        <q-select v-model="form.respDirector" :options="responsables"
                                                            option-label="nombre" option-value="idPersonal" emit-value
                                                            map-options outlined dense disable />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="person" class="q-mr-sm" />
                                                        SUPERVISADO
                                                    </td>
                                                    <td>
                                                        <q-select v-model="form.idSupervisado"
                                                            :options="trabajadoresCentro" option-label="nombre"
                                                            option-value="idPersonal" use-input input-debounce="400"
                                                            @filter="buscarTrabajadorCentro" fill-input hide-selected
                                                            label="Buscar personal del centro" outlined dense clearable
                                                            :disable="esVisualizacion" style="border: none;" emit-value
                                                            map-options>
                                                            <template v-slot:append>
                                                                <q-icon name="search" />
                                                            </template>
                                                        </q-select>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="text-left text-bold">
                                                        <q-icon name="event" class="q-mr-sm" />
                                                        FECHA DE REGISTRO
                                                    </td>
                                                    <td class="text-dark"><q-input v-model="form.fechaRegistro"
                                                            label="Fecha de registro" type="date" outlined dense
                                                            :disable="esVisualizacion" /></td>
                                                </tr>
                                                <tr v-if="mostrarAcreditacion">
                                                    <td class="text-left text-bold">
                                                        <q-icon name="person" class="q-mr-sm" />
                                                        ACREDITACIÓN VIGENTE
                                                    </td>
                                                    <td class="text-dark">
                                                        <q-select v-model="acreVigente" :options="acreditaciones"
                                                            option-label="acreditacion" option-value="id" emit-value
                                                            map-options outlined dense :disable="esVisualizacion" />
                                                    </td>
                                                </tr>
                                                <tr v-if="mostrarFechaAcreditacion">
                                                    <td class="text-left text-bold">
                                                        <q-icon name="event" class="q-mr-sm" />
                                                        FECHA DE ACREDITACIÓN
                                                    </td>
                                                    <td class="text-dark"><q-input v-model="fechaAcreditacion"
                                                            label="Fecha de acreditación" type="date" outlined dense
                                                            :disable="esVisualizacion" /></td>
                                                </tr>
                                            </tbody>
                                        </q-markup-table>
                                    </q-card-section>
                                </q-expansion-item>

                                <!-- ============================= -->
                                <!-- SECCIONES DINÁMICAS -->
                                <!-- ============================= -->

                                <div v-if="loading" class="text-center q-pa-lg">
                                    <q-spinner size="40px" color="primary" />
                                </div>

                                <div v-else>

                                    <q-expansion-item v-for="(seccion, index) in secciones" :key="index"
                                        :label="seccion.titulo" expand-separator
                                        header-class="bg-red-5 text-white q-mt-sm" expand-icon-class="text-white">
                                        <div class="q-pa-md">

                                            <!-- CABECERA -->
                                            <div class="row q-mb-sm text-weight-bold text-grey-7">
                                                <div class="col-6">
                                                    Pregunta
                                                </div>
                                                <div class="col-6">
                                                    Respuesta
                                                </div>
                                            </div>

                                            <q-separator class="q-mb-md" />

                                            <!-- PREGUNTAS -->
                                            <div v-for="pregunta in seccion.preguntas" :key="pregunta.idPregunta"
                                                v-if="mostrarPregunta(pregunta)"
                                                class="row q-col-gutter-md q-mb-sm items-center">

                                                <!-- SUBTITULO -->
                                                <div v-if="pregunta.tipoControl === 'label'"
                                                    class="col-12 text-body2 text-weight-bold text-uppercase q-mt-md">
                                                    {{ pregunta.pregunta }}
                                                </div>

                                                <!-- SELECT -->
                                                <template v-else-if="pregunta.tipoControl === 'select'">
                                                    <div class="col-6 text-body2">
                                                        {{ pregunta.pregunta }}
                                                    </div>
                                                    <div class="col-6">
                                                        <q-select outlined dense
                                                            :value="pregunta.respuesta"
                                                            @input="val => $set(pregunta, 'respuesta', val)"
                                                            :options="pregunta.opciones" emit-value map-options
                                                            :disable="esVisualizacion" style="border: none;"
                                                            :rules="pregunta.obligatoria ? [val => !!val || 'Debe seleccionar una opción'] : []" />

                                                        <!-- <q-input
                                                            v-if="pregunta.respuesta === 'OTRO' || pregunta.respuesta === 'OTROS'"
                                                            v-model="pregunta.otroTexto" label="Especifique" outlined
                                                            style="border: none;" dense
                                                            :rules="pregunta.obligatoria ? [val => !!val || 'Debe responder otro'] : []" /> -->
                                                    </div>
                                                </template>

                                                <!-- SELECT MULTIPLE -->
                                                <template v-else-if="pregunta.tipoControl === 'selectM'">
                                                    <div class="col-6 text-body2">
                                                        {{ pregunta.pregunta }}
                                                    </div>
                                                    <div class="col-6">
                                                        <q-select outlined dense multiple
                                                            :value="pregunta.respuesta"
                                                            @input="val => $set(pregunta, 'respuesta', val)"
                                                            :options="pregunta.opciones" emit-value map-options
                                                            :disable="esVisualizacion" />
                                                    </div>
                                                </template>

                                                <!-- TEXT -->
                                                <template v-else-if="pregunta.tipoControl === 'text'">
                                                    <div class="col-6 text-body2">
                                                        {{ pregunta.pregunta }}
                                                    </div>
                                                    <div class="col-6">
                                                        <q-input outlined dense
                                                            :value="pregunta.respuesta"
                                                            @input="val => $set(pregunta, 'respuesta', val)"
                                                            :disable="esVisualizacion"
                                                            :type="pregunta.tipoDato1 === 'NUMBER' ? 'number' : 'text'"
                                                            :rules="validarPregunta(pregunta)" style="border: none;" />
                                                    </div>
                                                </template>

                                                <!-- RADIO -->
                                                <template v-else-if="pregunta.tipoControl === 'radio'">

                                                    <div class="col-6 text-body2">
                                                        {{ pregunta.pregunta }}
                                                    </div>

                                                    <div class="col-6">

                                                        <q-option-group
                                                            :value="pregunta.respuesta"
                                                            @input="val => $set(pregunta, 'respuesta', val)"
                                                            :options="pregunta.opciones" type="radio" inline
                                                            :disable="esVisualizacion"
                                                            :rules="pregunta.obligatoria ? [val => !!val || 'Debe seleccionar una opción'] : []"
                                                            style="margin: 10px;" />

                                                    </div>

                                                </template>
                                                <!-- PREGUNTA 2 -->
                                                <template v-if="mostrarPregunta2(pregunta)"
                                                    class="col-12 q-mt-sm">

                                                    <div class="col-6 text-body2 q-mb-xs">
                                                        {{ pregunta.pregunta2 }}
                                                    </div>

                                                    <div class="col-6">
                                                        <!-- TEXT -->
                                                        <q-input v-if="pregunta.tipoControl2 === 'text'" outlined dense
                                                            v-model="pregunta.respuesta2" :disable="esVisualizacion"
                                                            style="border: none;"
                                                            :type="pregunta.tipoDato2 === 'NUMBER' ? 'number' : 'text'"
                                                            :rules="validarPregunta2(pregunta)" />

                                                        <!-- SELECT -->
                                                        <q-select v-if="pregunta.tipoControl2 === 'select'" outlined
                                                            dense v-model="pregunta.respuesta2"
                                                            :options="pregunta.opciones2" emit-value map-options
                                                            :disable="esVisualizacion" />
                                                    </div>

                                                </template>




                                            </div>



                                        </div>
                                    </q-expansion-item>

                                    <div v-if="mostrarTotales" class="row q-col-gutter-md q-mt-md bg-grey-2 q-pa-sm">

                                        <div class="q-mt-md">

                                            <div class="text-weight-bold">TOTAL</div>

                                        </div>

                                    </div>
                                    <div v-if="mostrarTotales" class="row q-col-gutter-md q-mt-md bg-grey-2 q-pa-sm">
                                        <div class="col-6 text-bold">
                                            CONFORME
                                        </div>
                                        <div class="col-6 text-right text-weight-bold text-primary">
                                            {{ totalesRespuestas.CONFORME }}
                                        </div>
                                    </div>
                                    <div v-if="mostrarTotales" class="row q-col-gutter-md q-mt-md bg-grey-2 q-pa-sm">
                                        <div class="col-6 text-bold">
                                            NO CONFORME
                                        </div>
                                        <div class="col-6 text-right text-weight-bold text-primary">
                                            {{ totalesRespuestas.NO_CONFORME }}
                                        </div>
                                    </div>
                                    <div v-if="mostrarTotales" class="row q-col-gutter-md q-mt-md bg-grey-2 q-pa-sm">
                                        <div class="col-6 text-bold">
                                            OBSERVACIÓN
                                        </div>
                                        <div class="col-6 text-right text-weight-bold text-primary">
                                            {{ totalesRespuestas.OBSERVACION }}
                                        </div>
                                    </div>
                                    <div v-if="mostrarTotales" class="row q-col-gutter-md q-mt-md bg-grey-2 q-pa-sm">
                                        <div class="col-6 text-bold">
                                            NO APLICA
                                        </div>
                                        <div class="col-6 text-right text-weight-bold text-primary">
                                            {{ totalesRespuestas.NO_APLICA }}
                                        </div>
                                    </div>

                                </div>


                            </q-card-section>

                        </q-card>
                        <!--  -->

                        <div v-if="!modoEdicion && form.audioUrl" class="q-pa-md">
                            <div class="col-6 text-body2 q-mt-sm text-weight-bold text-uppercase">Audio </div>
                            <audio controls style="width:100%">
                                <source :src="getAudioUrl(form.audioUrl)" type="audio/mpeg">

                            </audio>
                        </div>
                    </q-card-section>

                    <!-- FOOTER -->
                    <q-card-actions align="center">

                        <q-btn v-if="!esVisualizacion" label="Guardar" icon="save" type="submit" @click="guardarTodo" />
                        <q-btn label="Cancelar" v-close-popup style="min-width: 70px;" />
                    </q-card-actions>

                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogCentros" persistent>
                <q-card style="width:800px; max-width:100vw">

                    <q-card-section class="bg-header-dialog">
                        <span style="float: right;">
                            <q-btn icon="close" v-close-popup flat round size="sm"></q-btn>
                        </span>

                        <div class="text-body2 text-bold">SELECCIONAR CENTRO</div>
                    </q-card-section>

                    <q-card-section>

                        <q-table :data="centros" :columns="columnasCentros" row-key="idUnidadOrganica"
                            table-header-class="bg-inabif text-bold" dense flat bordered :loading="loadingCentros"
                            :filter="filtroCentros" :rows-per-page-options="[5, 10, 20, 50]">
                            <template v-slot:top-right>
                                <q-input dense outlined debounce="300" v-model="filtroCentros"
                                    placeholder="Buscar centro..." clearable>
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>

                            <template v-slot:body-cell-accion="props">
                                <q-td align="center">
                                    <q-btn label="Seleccionar" class="btn-inabif" size="sm"
                                        @click="seleccionarCentro(props.row)" />
                                </q-td>
                            </template>

                        </q-table>

                    </q-card-section>

                </q-card>
            </q-dialog>

        </div>

    </template>

<script>


import axios from "axios";

export default {

    name: 'Ficha',

    data() {
        return {

            dialog: false,
            loading: false,
            preguntasRaw: [],
            seccionAbierta: null,
            modoEdicion: false,
            loadingUnidades: false,
            loadingServicios: false,
            loadingAnexos: false,
            loadingResultados: false,
            //  modoVisualizacion: false,
            modo: null, // 'nuevo' | 'editar' | 'ver'
            responsables: [],
            responsableSeleccionado: null,
            trabajadoresCentro: [],
            periodoSeleccionado: null,
            periodos: [
                { id: '1', nombrePeriodo: 'I' },
                { id: '2', nombrePeriodo: 'II' },
                { id: '3', nombrePeriodo: 'III' },
            ],
            anioSeleccionado: null,
            anios: [
                { id: '20261', anio: '2026 - 1' },
                { id: '20262', anio: '2026 - 2' },
                { id: '20271', anio: '2027 - 1' },
                // { id: '2028', anio: '2028' },
            ],
            modoSupervision: 'PRESENCIAL',
            modalidades: [
                { id: 'presencial', modo: 'PRESENCIAL' },
                { id: 'virtual', modo: 'NO PRESENCIAL' },
            ],
            acreVigente: null,
            acreditaciones: [
                { id: '1', acreditacion: 'SI' },
                { id: '0', acreditacion: 'NO' },
            ],
            tipoFicha: null,
            tipos: [
                { id: 'PROGRAMADA', nombreTipo: 'PROGRAMADA' },
                { id: 'INOPINADA', nombreTipo: 'INOPINADA' },
            ],
            esSumable: true,
            form: {

                idUnidad: null,
                nombreUnidad: '',

                idServicio: null,
                nombreServicio: '',

                idAnexo: null,
                nombreAnexo: '',
                codigoAnexo2: '',
                fechaRegistro: null,
                codigoServicio: '',
                direccion: '',
                telefono: '',
                responsable: '',
                capacidad: null,

                idCentro: null,
                nombreCentro: '',
                departamento: '',
                provincia: '',
                distrito: '',
                respSupervision: '',
                respDirector: '',
                tipoCentro: '',
                idRespSupervision: null,
                idDirector: null,
                idSupervisado: null

            },
            // MODELOS
            unidadSeleccionada: null,
            servicioSeleccionado: null,
            centroSeleccionado: null,
            anexoSeleccionado: null,

            // LISTAS COMPLETAS
            unidades: [],

            servicios: [],

            centros: [],

            anexos: [],
            resultados: [],
            secciones: [],

            loadingTabla: false,
            filtroTabla: "",

            dataTableAnexos: [],

            columnasTableAnexos: [

                {
                    name: "idAnexoCabecera",
                    label: "ID",
                    field: "idAnexoCabecera",
                    align: "center",
                    sortable: true
                },


                {
                    name: "nombreUnidad",
                    label: "UNIDAD",
                    field: "nombreUnidad",
                    align: "center",
                    sortable: true
                },

                {
                    name: "nombreServicio",
                    label: "SERVICIO",
                    field: "nombreServicio",
                    align: "left",
                    sortable: true
                },

                {
                    name: "nombreCentro",
                    label: "CENTRO",
                    field: "nombreCentro",
                    align: "center",
                    sortable: true
                },
                {
                    name: "codigoAnexo2",
                    label: "CÓDIGO",
                    field: "codigoAnexo2",
                    align: "center",
                    sortable: true
                },
                {
                    name: "nombreAnexo",
                    label: "INSTRUMENTO",
                    field: "nombreAnexo",
                    align: "left",
                    sortable: true
                },
                {
                    name: "correlativo",
                    label: "CORRELATIVO",
                    field: "correlativo",
                    align: "center",
                    sortable: true
                },
                {
                    name: "estado",
                    label: "ESTADO",
                    field: "estado",
                    align: "center",
                    sortable: true
                },

                {
                    name: "acciones",
                    label: "ACCIONES",
                    field: "acciones",
                    align: "center"
                }

            ],
            dialogCentros: false,
            loadingCentros: false,
            centroNombre: "",

            columnasCentros: [
                {
                    name: "nombreUnidad",
                    label: "CENTRO",
                    field: "nombreUnidad",
                    align: "left",
                    sortable: true
                },
                {
                    name: "departamento",
                    label: "DEPARTAMENTO",
                    field: "departamento",
                    align: "left",
                    sortable: true
                },
                {
                    name: "provincia",
                    label: "PROVINCIA",
                    field: "provincia",
                    align: "left",
                    sortable: true
                },
                {
                    name: "distrito",
                    label: "DISTRITO",
                    field: "distrito",
                    align: "left",
                    sortable: true
                },
                {
                    name: "accion",
                    label: "ACCIÓN",
                    field: "accion",
                    align: "center"
                }
            ],
            filtroCentros: "",



        }
    },
    methods: {

        async editarRegistro(row) {
            this.modo = "editar";
            try {
                // Llenamos el form con los datos de la fila seleccionada
                this.form.idAnexoCabecera = row.idAnexoCabecera;
                this.form.idAnexo = row.idAnexo;
                this.form.idUnidad = row.idUnidad;
                this.form.idCentro = row.idCentro;
                this.form.correlativo = row.correlativo;

                this.form.nombreAnexo = row.nombreAnexo;
                this.form.codigoAnexo2 = row.codigoAnexo2;
                this.form.nombreUnidad = row.nombreUnidad;
                this.form.nombreCentro = row.nombreCentro;
                this.form.respDirector = row.respDirector;
                this.form.idDirector = row.idDirector;
                this.form.idRespSupervision = row.idRespSupervision;
                this.form.idSupervisado = row.idSupervisado;

                this.form.tipoCentro = row.tipoCentro;
                // Marcar modo edición
                this.modoEdicion = true;

                // Abrir diálogo
                this.dialog = true;

                // 1️⃣ Cargar preguntas del anexo
                // await this.cargarPreguntas();

                // 2️⃣ Cargar respuestas existentes
                await this.cargarRespuestas();

            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al cargar registro para editar" });
            }
        },

        async verRegistro(row) {
            this.modo = "ver";
            try {

                this.form.idAnexoCabecera = row.idAnexoCabecera;
                this.form.idAnexo = row.idAnexo;
                this.form.idUnidad = row.idUnidad;
                this.form.idCentro = row.idCentro;
                this.form.correlativo = row.correlativo;

                this.form.nombreAnexo = row.nombreAnexo;
                this.form.codigoAnexo2 = row.codigoAnexo2;
                this.form.nombreUnidad = row.nombreUnidad;
                this.form.nombreCentro = row.nombreCentro;
                this.form.respDirector = row.respDirector;
                this.form.idRespSupervision = row.idRespSupervision;
                this.form.idSupervisado = row.idSupervisado;
                this.form.tipoCentro = row.tipoCentro;
                this.modoEdicion = false;
                this.modoVisualizacion = true;

                this.dialog = true;

                await this.cargarRespuestas();

            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al visualizar registro" });
            }
        },

        async cargarRespuestas() {
            if (!this.form.idAnexoCabecera) return;

            if (this.secciones.length && this.secciones[0]?.idAnexoCabecera === this.form.idAnexoCabecera) {
                return;
            }

            this.loading = true;

            try {
                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/obtenerRespuestas`,
                    //  'http://10.101.0.8:4004/api/ms-sigesu/obtenerRespuestas',
                    {
                        params: {
                            idAnexoCabecera: this.form.idAnexoCabecera,
                            correlativo: this.form.correlativo
                        }
                    }
                );

                const data = res.data.data;
                if (!data || !data.respuestas) return;

                // Datos generales
                this.form.nombreCentro = data.nombreCentro;
                this.form.correlativo = data.correlativo;
                this.form.nombreAnexo = data.nombreAnexo;
                this.form.nombreUnidad = data.nombreUnidad;
                this.form.fechaAplicacion = data.fechaAplicacion;
                this.form.departamento = data.departamento;
                this.form.provincia = data.provincia;
                this.form.distrito = data.distrito;
                this.form.nombreServicio = data.nombreServicio;
                this.form.fechaRegistro = data.fechaRegistro;
                this.form.audioUrl = data.audioUrl;
                this.form.respDirector = data.respDirector;
                this.form.tipoCentro = data.tipoCentro;
                this.form.idRespSupervision = data.idRespSupervision;
                this.form.idSupervisado = data.idSupervisado;

                if (data.idSupervisado && data.nombreSupervisado) {
                    const existe = this.trabajadoresCentro.find(
                        x => x.idPersonal === data.idSupervisado
                    )

                    if (!existe) {
                        this.trabajadoresCentro.push({
                            idPersonal: data.idSupervisado,
                            nombre: data.nombreSupervisado
                        })
                    }
                }
                // Agrupar respuestas por secciones (cabecera)
                const secciones = [];
                let currentSeccion = { titulo: 'GENERAL', preguntas: [] }; // por defecto

                data.respuestas.forEach(p => {
                    if (p.tipoControl === 'cabecera') {
                        if (currentSeccion.preguntas.length > 0) secciones.push({ ...currentSeccion });
                        currentSeccion = { titulo: p.pregunta, preguntas: [] };
                    } else {
                        currentSeccion.preguntas.push(p);
                    }
                });
                if (currentSeccion.preguntas.length > 0) secciones.push(currentSeccion);

                // Transformar cada pregunta
                secciones.forEach(seccion => {
                    seccion.preguntas.forEach(p => {

                        // Parsear opciones si existen
                        if (p.opciones && typeof p.opciones === 'string') {
                            p.opciones = p.opciones
                                .split('|')
                                .map(op => op.trim())
                                .filter(Boolean)
                                .map(op => ({ label: op, value: op }));
                        } else {
                            p.opciones = [];
                        }

                        // Respuesta según tipo
                        switch (p.tipoControl) {
                            case 'label':
                                // pregunta solo lectura, no modificar
                                p.respuesta = p.respuesta || '';
                                break;

                            case 'text':
                                p.respuesta = p.respuesta || '';
                                break;

                            case 'radio':
                            case 'select':
                                if (p.respuesta != null && p.opciones.length > 0) {
                                    // Normalizar para coincidencia insensible a mayúsculas y tildes
                                    const normalizar = str => str.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                                    const respNorm = normalizar(p.respuesta);
                                    const match = p.opciones.find(o =>
                                        normalizar(o.value) === respNorm
                                    );
                                    p.respuesta = match ? match.value : null;
                                } else {
                                    p.respuesta = null;
                                }
                                break;

                            case 'selectM':
                            case 'checkbox':
                                if (p.respuesta) {
                                    p.respuesta = p.respuesta.split('|');
                                    if (p.tipoControl === 'checkbox') {
                                        p.respuesta = p.respuesta.map(v => v === '1');
                                    }
                                } else {
                                    p.respuesta = p.tipoControl === 'selectM' ? [] : [];
                                }
                                break;

                            default:
                                p.respuesta = p.respuesta || null;
                                break;
                        }

                        p.condicion = this.parseCondicion(p.condicion);
                    });
                });

                this.secciones = secciones;

            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al cargar las respuestas" });
            } finally {
                this.loading = false;
            }
        },
        async cargarTablaAnexos() {

            this.loadingTabla = true

            try {

                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/listarAnexosCabecera`
                    //  'http://10.101.0.8:4004/api/ms-sigesu/listarAnexosCabecera'
                )

                // si tu backend devuelve { data: [...] }
                this.dataTableAnexos = res.data.data || res.data

            } catch (error) {

                console.error(error)

                this.$q.notify({
                    type: 'negative',
                    message: 'Error al cargar la tabla'
                })

            } finally {

                this.loadingTabla = false

            }

        },



        formatAnexoLabel(opt) {
            return opt ? `${opt.codigoAnexo2} - ${opt.nombreAnexo}` : '';
        },
        limpiarCentro() {

            this.centroSeleccionado = null
            this.centroNombre = ""

            // si tienes form
            if (this.form) {
                this.form.idCentro = null
                this.form.nombreCentro = null
            }

        },
        /* ========================================
           ABRIR DIALOG
        ======================================== */
        abrirDialog() {
            this.modo = "nuevo";
            const faltantes = []

            if (!this.unidadSeleccionada) {
                faltantes.push('Unidad')
            }

            if (!this.servicioSeleccionado) {
                faltantes.push('Servicio')
            }

            if (!this.anexoSeleccionado) {
                faltantes.push('Anexo')
            }

            if (faltantes.length > 0) {

                this.$q.notify({
                    type: 'warning',
                    html: true,
                    message: `Debe seleccionar: <b>${faltantes.join(', ').toUpperCase()}</b>`
                })
                return
            }
            // buscar objetos seleccionados
            const unidad = this.unidades.find(
                u => u.idUnidad === this.unidadSeleccionada
            )

            const servicio = this.servicios.find(
                s => s.idServicio === this.servicioSeleccionado
            )

            const anexo = this.anexos.find(
                a => a.idAnexo === this.anexoSeleccionado
            )

            // llenar form
            this.form.idUnidad = unidad?.idUnidad || null
            this.form.nombreUnidad = unidad?.nombreUnidad || ''

            this.form.idServicio = servicio?.idServicio || null
            this.form.nombreServicio = servicio?.nombreServicio || ''

            this.form.idAnexo = anexo?.idAnexo || null
            this.form.nombreAnexo = anexo?.nombreAnexo || ''
            this.form.codigoAnexo2 = anexo?.codigoAnexo2 || ''
            this.form.fechaRegistro = new Date().toISOString().substring(0, 10)
            this.dialog = true


            this.modoEdicion = false

            this.cargarPreguntas()
        },
        async cargarCentros() {

            const res = await this.$axios.get(
                process.env.API_URL_SIGESU + "/centros/listar",
                {
                    params: {
                        idServicio: this.servicioSeleccionado,
                        tipoCentro: this.tipoCentroSeleccionado // 1 básico, 2 especializado, 3 urgencia
                    }
                }
            )

            this.centros = res.data
        },
        async abrirDialogCentros() {

            if (!this.unidadSeleccionada) {
                this.$q.notify({
                    type: "warning",
                    message: "Debe seleccionar una Unidad"
                })
                return
            }

            this.dialogCentros = true

            this.loadingCentros = true

            try {

                const res = await axios.get(
                    `${process.env.API_URL_SIGESU}/centros/listar`,

                    {
                        params: {
                            idServicio: this.servicioSeleccionado,
                            tipoCentro: this.tipoCentroSeleccionado
                        }
                    }
                )

                this.centros = res.data

            }
            catch (error) {

                console.error(error)


            }
            finally {
                this.loadingCentros = false
            }

        },
        seleccionarCentro(centro) {

            this.centroSeleccionado = centro
            this.centroNombre = centro.nombreUnidad
            this.form.idCentro = centro.idUnidadOrganica
            this.form.nombreCentro = centro.nombreUnidad
            this.form.tipoCentro = centro.tipoCentro
            this.form.departamento = centro.departamento
            this.form.provincia = centro.provincia
            this.form.distrito = centro.distrito
            this.form.respDirector = centro.respDirector;
            this.dialogCentros = false
        },

        /* ========================================
           RESET
        ======================================== */
        resetFormulario() {

            this.form = {
                nombreServicio: "",
                codigoServicio: "",
                direccion: "",
                telefono: "",
                responsable: "",
                capacidad: null,
                audioUrl: '',
            };

            this.preguntasAgrupadas = [];

        },
        parseOpciones(opciones) {

            if (!opciones || typeof opciones !== 'string')
                return []

            return opciones
                .split('|')
                .map(op => op.trim())
                .filter(Boolean)
                .map(op => ({
                    label: op,
                    value: op
                }))

        },

        async cargarPreguntasPorFiltros() {
            if (!this.unidadSeleccionada || !this.servicioSeleccionado || !this.anexoSeleccionado) {
                this.$q.notify({
                    type: "warning",
                    message: "Selecciona Unidad, Servicio y Anexo"
                });
                return;
            }

            this.loading = true;

            try {
                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/anexo/listar`,
                    // 'http://10.101.0.8:4004/api/ms-sigesu/anexo/listar',
                    {
                        params: {
                            idUnidadOrganica: this.unidadSeleccionada,
                            idServicio: this.servicioSeleccionado,
                            anexo: this.anexoSeleccionado
                        }
                    }
                );

                const data = res.data.data || [];

                console.log("Preguntas por filtros:", data);

                // aquí podrías asignarlas a un array propio, por ejemplo:
                this.preguntasFiltradas = data;

            } catch (error) {
                console.error(error);
                this.$q.notify({
                    type: "negative",
                    message: "Error al cargar preguntas por Unidad, Servicio y Anexo"
                });
            } finally {
                this.loading = false;
            }
        },

        async cargarPreguntas() {

            this.loading = true

            try {

                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/findAllAnexoPregustasByParams2`,
                    {
                        params: {
                            anexo: this.anexoSeleccionado,
                            idServicio: this.servicioSeleccionado
                        }
                    }

                )
                // console.log("RESPUESTA COMPLETA:", res)
                //  console.log("res.data:", res.data)
                //  console.log("res.data.data:", res.data?.data)
                const data = res.data.data || []

                // ordenar por grupo y número de pregunta
                const listaOrdenada = data.sort(
                    (a, b) => a.numGrupo - b.numGrupo || a.numPregunta - b.numPregunta
                )

                this.preguntasRaw = listaOrdenada

                const secciones = []
                let seccionActual = null

                listaOrdenada.forEach(p => {

                    // 🔹 asegurar obligatoria
                    const obligatoria = Number(p.obligatoria ?? 0)

                    if (p.tipoControl === 'cabecera') {

                        seccionActual = {
                            titulo: p.pregunta,
                            preguntas: [{
                                ...p,
                                obligatoria,
                                respuesta: 1,
                                opciones: []
                            }]
                        }

                        secciones.push(seccionActual)
                        return
                    }

                    if (!seccionActual) return

                    if (p.tipoControl === 'label') {

                        seccionActual.preguntas.push({
                            ...p,

                            obligatoria,
                            respuesta: 2,
                            opciones: [
                                { label: 'SI', value: 1 },
                                { label: 'NO', value: 0 }
                            ]
                        })

                        return
                    }

                    let respuesta = null
                    let opciones = [
                        { label: 'SI', value: 1 },
                        { label: 'NO', value: 0 }
                    ]

                    switch (p.tipoControl) {

                        case 'text':
                            respuesta = ''
                            break

                        case 'select':
                        case 'radio':
                            respuesta = null
                            opciones = this.parseOpciones(p.opciones)
                            break

                        case 'selectM':
                            respuesta = []
                            opciones = this.parseOpciones(p.opciones)
                            break

                        default:
                            respuesta = null
                            break
                    }

                    seccionActual.preguntas.push({
                        ...p,

                        tipoDato1: p.tipoDato1,
                        tipoDato2: p.tipoDato2,

                        obligatoria: Number(p.obligatoria ?? 0),
                        obligatoria2: Number(p.obligatoria2 ?? 0),

                        respuesta,
                        respuesta2: null,

                        opciones,
                        opciones2: this.parseOpciones(p.opciones2),

                        pregunta2: p.pregunta2,
                        tipoControl2: p.tipoControl2,
                        condicion: this.parseCondicion(p.condicion),
                        // condicion: p.condicion ? JSON.parse(p.condicion) : null,
                        //condicion: p.condicion || null,
                        otroTexto: null,
                        esSumable: p.tipoControl === 'select'

                    })

                })

                this.secciones = secciones

                console.log("Preguntas cargadas:", this.secciones)

            } catch (error) {

                console.error(error)

                this.$q.notify({
                    type: 'negative',
                    message: 'Error al cargar preguntas'
                })

            } finally {

                this.loading = false

            }
        },

        /* ========================================
           GUARDAR TODO
        ======================================== */

        async guardarTodo() {

            try {
                // DEBUG: Verificar valores de selects antes de guardar
                console.log('=== DEBUG GUARDAR TODO ===');
                this.secciones.forEach(sec => {
                    sec.preguntas.forEach(p => {
                        if (p.tipoControl === 'select' || p.tipoControl === 'selectM' || p.tipoControl === 'radio') {
                            console.log(`Pregunta ID ${p.idPregunta} (${p.tipoControl}): respuesta =`, p.respuesta);
                        }
                    });
                });

                //  limpiar respuestas ocultas
                this.secciones.forEach(sec => {
                    sec.preguntas.forEach(p => {
                        if (!this.mostrarPregunta2(p)) {
                            p.respuesta2 = null
                        }
                    })
                })
                // VALIDAR OBLIGATORIOS
                for (const seccion of this.secciones) {
                    for (const pregunta of seccion.preguntas) {

                        // SOLO VALIDAR SI ES VISIBLE
                        if (!this.mostrarPregunta(pregunta)) continue

                        if (pregunta.obligatoria === 1) {

                            const resp = pregunta.respuesta

                            if (!resp || (Array.isArray(resp) && resp.length === 0)) {

                                this.$q.notify({
                                    type: "warning",
                                    message: `Debe responder: ${pregunta.pregunta}`
                                })

                                return
                            }
                        }

                        // 🔥 VALIDAR PREGUNTA 2
                        if (this.mostrarPregunta2(pregunta) && pregunta.obligatoria2 === 1) {

                            if (!pregunta.respuesta2) {

                                this.$q.notify({
                                    type: "warning",
                                    message: `Debe responder: ${pregunta.pregunta2}`
                                })

                                return
                            }
                        }

                    }
                }

                const respuestas = this.secciones.flatMap(seccion =>
                    seccion.preguntas
                        .filter(p => this.mostrarPregunta(p))
                        .map(p => ({

                            idPregunta: p.idPregunta,

                            // 🔹 RESPUESTA 1
                            respuesta: (() => {

                                if (['cabecera', 'label'].includes(p.tipoControl)) {
                                    return p.tipoControl === 'cabecera' ? 1 : 2
                                }

                                // 🔥 OTRO (simple)
                                if (p.respuesta === 'OTRO' || p.respuesta === 'OTROS') {
                                    return p.otroTexto || p.respuesta
                                }

                                // 🔥 OTRO (multiple)
                                if (Array.isArray(p.respuesta)) {

                                    if (p.respuesta.includes('OTRO') || p.respuesta.includes('OTROS')) {

                                        return p.respuesta
                                            .map(r => (r === 'OTRO' || r === 'OTROS') ? (p.otroTexto || r) : r)
                                            .join('|')
                                    }

                                    return p.respuesta.join('|')
                                }

                                return p.respuesta ?? null

                            })(),

                            // 🔹 RESPUESTA 2
                            respuesta2: this.mostrarPregunta2(p)
                                ? (() => {

                                    // OTRO en pregunta2 (si aplica)
                                    if (p.respuesta2 === 'OTRO' || p.respuesta2 === 'OTROS') {
                                        return p.otroTexto2 || p.respuesta2
                                    }

                                    return p.respuesta2 ?? null

                                })()
                                : null,

                            observacion: null,
                            puntaje: null

                        }))
                );

                // DEBUG: Confirmar valores finales del payload antes de enviar
                console.log('=== PAYLOAD RESPUESTAS ===', respuestas);

                /*
                                const respuestas = this.secciones.flatMap(seccion =>
                                    seccion.preguntas.filter(p => this.mostrarPregunta(p)).map(p => ({
                                        idPregunta: p.idPregunta,
                                        respuesta: ['cabecera', 'label'].includes(p.tipoControl)
                                            ? (p.tipoControl === 'cabecera' ? 1 : 2)
                                            : (Array.isArray(p.respuesta) ? p.respuesta.join('|') : p.respuesta ?? null),
                                        respuesta2: this.mostrarPregunta2(p)
                                            ? p.respuesta2 ?? null
                                            : null,
                                        observacion: null,
                                        puntaje: null
                                    }))
                                );*/

                const payload = {
                    idAnexo: this.form.idAnexo,
                    idCentro: this.form.idCentro,
                    correlativo: this.form.correlativo,
                    fechaAplicacion: new Date().toISOString().split('T')[0],
                    fechaRegistro: this.form.fechaRegistro,
                    idRespSupervision: this.form.idRespSupervision,
                    idDirector: this.form.idDirector,
                    idSupervisado: this.form.idSupervisado,
                    respuestas,
                    totales: {
                        conforme: this.totalesRespuestas.CONFORME,
                        noConforme: this.totalesRespuestas.NO_CONFORME,
                        observacion: this.totalesRespuestas.OBSERVACION,
                        noAplica: this.totalesRespuestas.NO_APLICA
                    }
                };

                if (this.modoEdicion) {

                    payload.idCabecera = this.form.idAnexoCabecera;
                    payload.usuModifica = parseInt(this.$q.localStorage.getItem('sgs-idUsuario'));

                    await this.$axios.put(
                        `${process.env.API_URL_SIGESU}/updateAnexoCompleto`,
                        payload
                    );

                } else {

                    payload.usuRegistra = parseInt(this.$q.localStorage.getItem('sgs-idUsuario'));

                    await this.$axios.post(
                        `${process.env.API_URL_SIGESU}/createAnexoCompleto`,
                        payload
                    );

                }

                this.$q.notify({
                    type: "positive",
                    message: this.modoEdicion ? "Actualizado correctamente" : "Registrado correctamente"
                });

                this.dialog = false;
                this.cargarTablaAnexos();

            } catch (error) {

                console.error(error);

                this.$q.notify({
                    type: "negative",
                    message: "Error al guardar"
                });

            }

        },

        onUnidadChange() {
            this.servicioSeleccionado = null
            this.centroSeleccionado = null
            this.anexoSeleccionado = null
        },

        onServicioChange() {
            this.centroSeleccionado = null
            this.anexoSeleccionado = null
        },

        onCentroChange() {
            // si necesitas lógica adicional
        },
        // Cargar todas las unidades
        async cargarUnidades() {
            this.loadingUnidades = true;
            try {
                const res = await axios.get(`${process.env.API_URL_SIGESU}/anexo/unidadesSugesu`);
                //const res = await axios.get('http://10.101.0.8:4004/api/ms-sigesu/anexo/unidadesSugesu');
                this.unidades = res.data.data || [];
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: 'negative', message: 'Error al cargar unidades' });
            } finally {
                this.loadingUnidades = false;
            }
        },

        // Cargar servicios según unidad seleccionada
        async cargarServicios() {
            if (!this.unidadSeleccionada) return;
            this.loadingServicios = true;
            try {
                const res = await axios.get(`${process.env.API_URL_SIGESU}/anexo/unidades-serviciosSugesu`, {
                    // const res = await axios.get('http://10.101.0.8:4004/api/ms-sigesu/anexo/unidades-serviciosSugesu', {
                    params: { idUnidadOrganica: this.unidadSeleccionada }
                });
                this.servicios = res.data.data || [];
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: 'negative', message: 'Error al cargar servicios' });
            } finally {
                this.loadingServicios = false;
            }
        },

        // Cargar anexos según unidad + servicio seleccionados
        async cargarAnexos() {
            if (!this.unidadSeleccionada || !this.servicioSeleccionado) return;
            this.loadingAnexos = true;
            try {
                const res = await axios.get(`${process.env.API_URL_SIGESU}/anexo/anexos-por-servicioSugesu`, {
                    //  const res = await axios.get('http://10.101.0.8:4004/api/ms-sigesu/anexo/anexos-por-servicioSugesu', {
                    params: {
                        idUnidadOrganica: this.unidadSeleccionada,
                        idServicio: this.servicioSeleccionado
                    }
                });
                this.anexos = res.data.data || [];
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: 'negative', message: 'Error al cargar anexos' });
            } finally {
                this.loadingAnexos = false;
            }
        },
        async cargarResultados() {
            if (!this.unidadSeleccionada || !this.servicioSeleccionado || !this.anexoSeleccionado) return;
            this.loadingResultados = true;
            try {
                const res = await axios.get(`${process.env.API_URL_SIGESU}/anexo/listar`, {
                    // const res = await this.$axios.get('http://10.101.0.8:4004/api/ms-sigesu/anexo/listar', {
                    params: {
                        idUnidadOrganica: this.unidadSeleccionada,
                        idServicio: this.servicioSeleccionado,
                        anexo: this.anexoSeleccionado
                    }
                });
                this.resultados = res.data.data || [];
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: 'negative', message: 'Error al cargar resultados' });
            } finally {
                this.loadingResultados = false;
            }
        },

        resetModo() {
            this.modo = null;
        },

        async descargarPDF() {
            try {

                const response = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/anexo/pdf`,
                    // "http://10.101.0.8:4004/api/ms-sigesu/anexo/pdf",
                    {
                        params: {
                            idAnexoCabecera: this.form.idAnexoCabecera,
                            correlativo: this.form.correlativo
                        },
                        responseType: "blob"
                    }
                );

                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `Anexo_${this.form.idAnexoCabecera}.pdf`;
                link.click();

                window.open(url, "_blank");
                //  window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error(error);
            }
        },
        async agregarAudio(row) {

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "audio/*";

            input.onchange = async (event) => {

                const file = event.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("audio", file);
                formData.append("idAnexoCabecera", row.idAnexoCabecera);

                try {
                    await this.$axios.post(
                        `${process.env.API_URL_SIGESU}/anexo/upload-audio`,
                        //"http://10.101.0.8:4004/api/ms-sigesu/anexo/upload-audio",
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" }
                        }
                    );

                    this.$q.notify({
                        type: "positive",
                        message: "Audio subido correctamente"
                    });

                    this.cargarTablaAnexos();

                } catch (error) {
                    console.error(error);
                    this.$q.notify({
                        type: "negative",
                        message: "Error al subir audio"
                    });
                }

            };

            input.click();
        },

        getAudioUrl(file) {
            return `${process.env.API_URL_SIGESU}/uploads/audios/${file}`;
        },

        async cargarResponsables() {
            try {

                const res = await this.$axios.get(
                    process.env.API_URL_SIGESU + "/responsables-supervision",
                    {
                        params: {
                            abreviatura: "UNIDAD DE FORTALECIMIENTO DE SERVICIOS Y COORDINACIÓN TERRITORIAL"
                        }
                    }
                )

                this.responsables = res.data

            } catch (error) {

                console.error(error)

                this.$q.notify({
                    type: "negative",
                    message: "Error al cargar responsables"
                })

            }
        },
        async buscarTrabajadorCentro(val, update) {

            if (val.length < 2) {
                update(() => {
                    this.trabajadoresCentro = []
                })
                return
            }

            try {

                const res = await this.$axios.get(
                    process.env.API_URL_SIGESU + "/responsables-centro",
                    {
                        params: {
                            nombreCentro: this.form.nombreCentro,
                            nombrePersona: val
                        }
                    }
                )

                update(() => {
                    this.trabajadoresCentro = res.data
                })

            } catch (error) {
                console.error(error)
            }

        },
        validarPregunta(pregunta) {

            const reglas = []

            if (pregunta.obligatoria === 1) {
                reglas.push(v => !!v || 'Este campo es obligatorio')
            }

            if (pregunta.tipoDato1 === 'NUMBER') {
                reglas.push(v => !v || !isNaN(v) || 'Debe ingresar un número')
            }

            if (pregunta.condicion && pregunta.condicion.tipo === 'RANGO') {

                const min = pregunta.condicion.min
                const max = pregunta.condicion.max

                reglas.push(val => {
                    if (!val) return true
                    return Number(val) >= min || `Mínimo permitido: ${min}`
                })

                reglas.push(val => {
                    if (!val) return true
                    return Number(val) <= max || `Máximo permitido: ${max}`
                })
            }

            return reglas
        },
        validarPregunta2(pregunta) {

            const reglas = []

            if (pregunta.obligatoria2 === 1 && this.mostrarPregunta2(pregunta)) {
                reglas.push(v => !!v || 'Este campo es obligatorio')
            }

            if (pregunta.tipoDato2 === 'NUMBER') {
                reglas.push(v => !v || !isNaN(v) || 'Debe ingresar un número')
            }

            return reglas
        },
        mostrarPregunta2(pregunta) {

            if (!pregunta.pregunta2) return false

            const resp = pregunta.respuesta
            if (!resp) {
                pregunta.respuesta2 = null // 🔥 limpiar
                return false
            }

            const cond = pregunta.condicion

            if (!cond) return true

            if (cond.id) {

                const preguntaBase = this.buscarPregunta(cond.id)

                if (!preguntaBase || !preguntaBase.respuesta) {
                    pregunta.respuesta2 = null // 🔥 limpiar
                    return false
                }

                const valorBase = preguntaBase.respuesta

                if (!isNaN(cond.valor)) {
                    const cumple = Number(valorBase) >= Number(cond.valor)
                    if (!cumple) pregunta.respuesta2 = null
                    return cumple
                }

                const base = valorBase.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                const condValor = cond.valor.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

                const cumple = base === condValor
                if (!cumple) pregunta.respuesta2 = null

                return cumple
            }

            const valor = resp.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const condValor = cond.valor?.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            const cumple = valor === condValor

            if (!cumple) pregunta.respuesta2 = null // 🔥 limpiar

            return cumple
        },
        mostrarPregunta(pregunta) {

            if (!pregunta.condicion) return true

            const cond = pregunta.condicion

            // 🔴 si no tiene id → no es de este tipo
            if (!cond.id) return true

            const preguntaBase = this.buscarPregunta(cond.id)

            // Si la pregunta base no existe o no tiene respuesta válida, ocultar la condicional
            if (!preguntaBase) return false
            const baseRespuesta = preguntaBase.respuesta
            if (baseRespuesta === null || baseRespuesta === undefined || baseRespuesta === '') {
                return false
            }

            const valorBase = preguntaBase.respuesta

            // NUMÉRICO
            if (!isNaN(cond.valor)) {
                return Number(valorBase) >= Number(cond.valor)
            }

            // TEXTO (soporta base simple, base array, condicion simple y condicion array)
            return this.normalizarCondicion(valorBase, cond.valor)
        },
        buscarPregunta(id) {
            for (const seccion of this.secciones) {
                const p = seccion.preguntas.find(x => x.idPregunta === id)
                if (p) return p
            }
            return null
        },
        normalizarCondicion(valorBase, condValor) {
            const n = v => v?.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const bases = Array.isArray(valorBase) ? valorBase : [valorBase];
            const conds = Array.isArray(condValor) ? condValor : [condValor];
            const baseVals = bases.map(n).filter(v => v !== '');
            const condVals = conds.map(n).filter(v => v !== '');
            if (baseVals.length === 0 || condVals.length === 0) return false;
            return baseVals.some(b => condVals.includes(b));
        },
        parseCondicion(condicion) {

            if (!condicion) return null

            try {
                // 🔹 intenta JSON primero
                return JSON.parse(condicion)
            } catch (e) {

                // 🔹 fallback formato antiguo (edad tipo: 2240; > 13)
                try {

                    const partes = condicion.split(';')

                    if (partes.length === 2) {

                        const id = parseInt(partes[0].trim())
                        const valor = partes[1].replace(/[^\d]/g, '').trim()

                        return {
                            id: id,
                            valor: Number(valor)
                        }
                    }

                } catch (err) {
                    console.error("Error parseando condición:", condicion)
                }

                return null
            }
        }

    },


    created() {

        this.cargarUnidades();
        this.cargarTablaAnexos();
        this.cargarResponsables()
    },
    watch: {
        unidadSeleccionada() {
            this.servicioSeleccionado = null;
            this.anexoSeleccionado = null;
            this.servicios = [];
            this.anexos = [];
            if (this.unidadSeleccionada) this.cargarServicios();

            this.centroSeleccionado = null
            this.centroNombre = ""
        },
        servicioSeleccionado() {
            this.cargarCentros()
            this.anexoSeleccionado = null;
            this.anexos = [];
            this.centroSeleccionado = null
            this.centroNombre = ""
            if (this.servicioSeleccionado) this.cargarAnexos();
        },
        acreVigente(val) {
            if (val !== '1') {
                this.fechaAcreditacion = null
            }
        }

    },
    computed: {

        codigosConModalidad() {
            return [
                "FO_CAR01", "FS_CAR01", "FS_CAR02",
                "FO_CED01", "FS_CED01", "FS_CED02",
                "FS_SEC01", "FS_SEC02",
                "FS_ACE01", "FS_ACE02",
                "FS_FAM01", "FS_FAM02",
                "FS_AEA01", "FS_AEA02", "FS_AEA03",
                "FS_INA01"
            ]
        },
        mostrarModalidad() {
            return this.codigosConModalidad.includes(this.form.codigoAnexo2)
        },
        codigosConAcreditacion() {
            return [
                "FO_CAR01", "FS_CAR02"
            ]
        },
        mostrarAcreditacion() {
            return this.codigosConAcreditacion.includes(this.form.codigoAnexo2)
        },
        mostrarFechaAcreditacion() {

            // 🔹 primero validar que el anexo aplique
            if (!this.mostrarAcreditacion) return false

            // 🔹 luego validar respuesta SI
            const valor = this.acreVigente?.toString().toUpperCase()

            return valor === "1" || valor === "SI"
        },
        tituloAnexo() {

            const anexo = this.anexos.find(
                a => a.idAnexo === this.form.idAnexo
            )

            if (!anexo) {
                return this.form.codigoAnexo2
                    ? `${this.form.codigoAnexo2} - ${this.form.nombreAnexo}`
                    : 'INSTRUMENTO DE SUPERVISIÓN'
            }

            return `${anexo.codigoAnexo2} - ${anexo.nombreAnexo}`

        },
        esVisualizacion() {
            return this.modo === "ver";
        },
        modoEdicion() {
            return this.modo === "editar";
        },

        codigosConTotales() {
            return [
                "FS_CAR01",
                "FS_CAR02",
                "FS_CED01",
                "FS_CED02",
                "FS_SEC01",
                "FS_SEC02",
                "FS_ACE01",
                "FS_ACE02",
                "FS_FAM01",
                "FS_FAM02",
                "FS_AEA01",
                "FS_AEA02",
                "FS_AEA03",
                "FS_INA01"
            ]
        },

        mostrarTotales() {
            return this.codigosConTotales.includes(this.form.codigoAnexo2)
        },
        totalesRespuestas() {

            const totales = {
                CONFORME: 0,
                NO_CONFORME: 0,
                OBSERVACION: 0,
                NO_APLICA: 0
            }

            this.secciones.forEach(sec => {
                sec.preguntas.forEach(p => {

                    if (!p.respuesta) return

                    const valor = p.respuesta
                        .toString()
                        .toUpperCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()

                    if (valor === 'CONFORME') totales.CONFORME++
                    else if (valor === 'NO CONFORME') totales.NO_CONFORME++
                    else if (valor === 'OBSERVACION') totales.OBSERVACION++
                    else if (valor === 'NO APLICA') totales.NO_APLICA++

                })
            })


            return totales
        }

    }

}
</script>
