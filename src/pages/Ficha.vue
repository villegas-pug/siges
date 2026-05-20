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
                    <q-btn label="NUEVO" icon="add" class="btn-inabif" size="sm" @click="abrirDialog"
                        :disable="!puedeCrearNuevo" />
                    <q-btn label="EXCEL" icon="download" color="green" class="btn-seccion-acciones" size="sm" />
                </div>
            </div>
            <!-- TABLA -->
            <div class="q-pa-md">
                <div class="col-12">

                    <q-table class="tabla-anexos" :data="dataTableFiltrada" :columns="columnasTableAnexos" row-key="idAnexoCabecera"
                        table-header-class="bg-inabif text-bold" :rows-per-page-options="[10, 20, 50]"
                        :filter="filtroTabla" :loading="loadingTabla" dense flat bordered>
                        <!-- SLOT PARA ESTADO -->
                        <template v-slot:body-cell-estado="props">
                            <q-td :props="props">
                                <q-chip
                                    class="chip-estado"
                                    :class="`chip-estado--${String(props.row.estado)}`"
                                    :color="estadosMap[props.row.estado]?.color || 'grey'"
                                    :text-color="estadosMap[props.row.estado]?.textColor || 'white'"
                                    :icon="estadosMap[props.row.estado]?.icon || 'help'"
                                    size="sm"
                                >
                                    {{ estadosMap[props.row.estado]?.label || 'DESCONOCIDO' }}
                                </q-chip>
                            </q-td>
                        </template>

                        <!-- SLOTS PARA TEXTO LARGO CON TOOLTIP -->
                        <template v-slot:body-cell-nombreUnidad="props">
                            <q-td :props="props">
                                <div class="ellipsis" :title="props.row.nombreUnidad">
                                    {{ props.row.nombreUnidad }}
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-nombreServicio="props">
                            <q-td :props="props">
                                <div class="ellipsis" :title="props.row.nombreServicio">
                                    {{ props.row.nombreServicio }}
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-nombreCentro="props">
                            <q-td :props="props">
                                <div class="ellipsis" :title="props.row.nombreCentro">
                                    {{ props.row.nombreCentro }}
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-nombreAnexo="props">
                            <q-td :props="props">
                                <div class="ellipsis" :title="props.row.nombreAnexo">
                                    {{ props.row.nombreAnexo }}
                                </div>
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
                            <q-td :props="scope">
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
                                        <q-item clickable v-close-popup @click="abrirDialogAudios(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="mic" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Agregar Audio</q-item-section>
                                        </q-item>
                                        <!-- Validar Ficha -->
                                        <q-item clickable v-close-popup @click="abrirDialogValidarFicha(scope.row)">
                                            <q-item-section avatar>
                                                <q-avatar icon="verified" color="red" text-color="white" />
                                            </q-item-section>
                                            <q-item-section>Validar Ficha</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
                            </q-td>
                        </template>

                    </q-table>

                </div>
            </div>
            <q-dialog v-model="dialog" persistent @hide="resetModo">
                <q-card class="ficha-dialog">
                    <div class="ficha-scroll-wrapper">

                        <!-- HEADER -->
                        <q-card-section class="bg-inabif ficha-header">
                        <div class="ficha-titulo">
                            {{ tituloAnexo }}
                        </div>
                        <q-btn class="ficha-cerrar" icon="close" flat dense round v-close-popup />
                    </q-card-section>

                    <!-- BODY -->
                        <q-card-section class="ficha-body" style="flex: 1; overflow-y: auto;">

                        <q-card flat>

                            <q-card-section>
                                <div v-if="esVisualizacion" class="ficha-pdf-bar">
                                    <q-btn label="Descargar PDF" icon="picture_as_pdf" color="green" @click="descargarPDF" />
                                </div>

                                <!-- ============================= -->
                                <!-- I. DATOS GENERALES (ACORDEÓN) -->
                                <!-- ============================= -->

                                <q-expansion-item
                                    group="ficha-secciones"
                                    label="I. DATOS GENERALES DEL SERVICIO"
                                    expand-separator header-class="bg-red-5 text-white q-mt-sm header-seccion"
                                    expand-icon-class="text-white">

                                    <q-card-section class="q-pa-md">
                                        <div class="tabla-scroll-container">
                                            <q-markup-table bordered dense class="rounded-borders datos-generales-tabla">
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
                                                        SUPERVISADO (OS)
                                                    </td>
                                                    <td>
                                                        <div class="row q-col-gutter-sm items-center">
                                                            <div class="col">
                                                                <q-select v-model="form.idsSupervisados"
                                                                    :options="trabajadoresCentro" option-label="nombre"
                                                                    option-value="idPersonal" multiple use-chips
                                                                    label="Seleccionar supervisados" outlined dense
                                                                    clearable :disable="esVisualizacion"
                                                                    style="border: none;" emit-value map-options>
                                                                </q-select>
                                                            </div>
                                                            <div class="col-auto" v-if="!esVisualizacion">
                                                                <q-btn icon="search" flat round dense color="primary"
                                                                    @click="abrirDialogSupervisados" />
                                                            </div>
                                                        </div>
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
                                        </div>
                                    </q-card-section>
                                </q-expansion-item>

                                <!-- ============================= -->
                                <!-- SECCIONES DINÁMICAS -->
                                <!-- ============================= -->

                                <div v-if="loading" class="text-center q-pa-lg">
                                    <q-spinner size="40px" color="primary" />
                                </div>

                                <div v-else>

                                    <q-expansion-item
                                        v-for="(seccion, index) in secciones"
                                        :key="index"
                                        group="ficha-secciones"
                                        :label="seccion.titulo" expand-separator
                                        header-class="bg-red-5 text-white q-mt-sm header-seccion seccion-expansion" expand-icon-class="text-white">
                                        <div class="q-pa-md">

                                            <!-- CABECERA -->
                                            <div class="row seccion-cabecera q-mb-sm text-weight-bold text-grey-7">
                                                <div class="col-12 col-sm-5">
                                                    Pregunta
                                                </div>
                                                <div class="col-12 col-sm-7">
                                                    Respuesta
                                                </div>
                                            </div>

                                            <q-separator class="q-mb-md" />

                                            <!-- PREGUNTAS -->
                                            <div v-for="pregunta in seccion.preguntas" :key="pregunta.idPregunta"
                                                v-if="mostrarPregunta(pregunta)"
                                                class="ficha-pregunta">

                                                <!-- SUBTITULO -->
                                                <div v-if="pregunta.tipoControl === 'label'"
                                                    class="col-12 pregunta-label">
                                                    <span class="text-body2 text-weight-bold text-uppercase">
                                                    {{ pregunta.pregunta }}
                                                    </span>
                                                </div>

                                                <!-- SELECT -->
                                                <template v-else-if="pregunta.tipoControl === 'select'">
                                                    <div class="ficha-campo">
                                                        <div class="ficha-label">
                                                            {{ pregunta.pregunta }}
                                                            <span v-if="pregunta.obligatoria === 1" class="ficha-obligatorio">*</span>
                                                        </div>
                                                        <div class="ficha-input" :class="{ 'modo-visualizacion': esVisualizacion }">
                                                            <template v-if="esVisualizacion && pregunta.respuesta">
                                                                <span class="ficha-valor">{{ pregunta.respuesta }}</span>
                                                            </template>
                                                            <q-select v-else outlined dense
                                                                :value="pregunta.respuesta"
                                                                @input="val => $set(pregunta, 'respuesta', val)"
                                                                :options="pregunta.opciones" emit-value map-options
                                                                :disable="esVisualizacion"
                                                                :rules="pregunta.obligatoria ? [val => !!val || 'Debe seleccionar una opción'] : []">
                                                                <template v-slot:selected-item="scope">
                                                                    <div class="row items-center no-wrap">
                                                                        <img v-if="getOptionImage(pregunta, scope.opt)" :src="getOptionImage(pregunta, scope.opt)" class="select-option-img q-mr-sm" />
                                                                        <span>{{ scope.opt.label }}</span>
                                                                    </div>
                                                                </template>
                                                                <template v-slot:option="scope">
                                                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar v-if="getOptionImage(pregunta, scope.index + 1)">
                                                                            <img :src="getOptionImage(pregunta, scope.index + 1)" class="select-option-img" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- SELECT MULTIPLE -->
                                                <template v-else-if="pregunta.tipoControl === 'selectM'">
                                                    <div class="ficha-campo">
                                                        <div class="ficha-label">
                                                            {{ pregunta.pregunta }}
                                                            <span v-if="pregunta.obligatoria === 1" class="ficha-obligatorio">*</span>
                                                        </div>
                                                        <div class="ficha-input" :class="{ 'modo-visualizacion': esVisualizacion }">
                                                            <template v-if="esVisualizacion && pregunta.respuesta && pregunta.respuesta.length">
                                                                <div class="ficha-tags">
                                                                    <span v-for="item in pregunta.respuesta" :key="item" class="ficha-tag">{{ item }}</span>
                                                                </div>
                                                            </template>
                                                            <q-select v-else outlined dense multiple use-chips
                                                                :value="pregunta.respuesta"
                                                                @input="val => $set(pregunta, 'respuesta', val)"
                                                                :options="pregunta.opciones" emit-value map-options
                                                                :disable="esVisualizacion">
                                                                <template v-slot:selected-item="scope">
                                                                    <q-chip removable @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex" class="q-ma-none">
                                                                        <img v-if="getOptionImage(pregunta, scope.opt)" :src="getOptionImage(pregunta, scope.opt)" class="select-option-img q-mr-xs" />
                                                                        {{ scope.opt.label }}
                                                                    </q-chip>
                                                                </template>
                                                                <template v-slot:option="scope">
                                                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar v-if="getOptionImage(pregunta, scope.index + 1)">
                                                                            <img :src="getOptionImage(pregunta, scope.index + 1)" class="select-option-img" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                            </q-select>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- TEXT -->
                                                <template v-else-if="pregunta.tipoControl === 'text'">
                                                    <div class="ficha-campo">
                                                        <div class="ficha-label">
                                                            {{ pregunta.pregunta }}
                                                            <span v-if="pregunta.obligatoria === 1" class="ficha-obligatorio">*</span>
                                                        </div>
                                                        <div class="ficha-input" :class="{ 'modo-visualizacion': esVisualizacion }">
                                                            <template v-if="esVisualizacion">
                                                                <span class="ficha-valor">{{ pregunta.respuesta || '—' }}</span>
                                                            </template>
                                                            <q-input v-else outlined dense
                                                                :value="pregunta.respuesta"
                                                                @input="val => $set(pregunta, 'respuesta', val)"
                                                                :disable="esVisualizacion"
                                                                :type="pregunta.tipoDato1 === 'NUMBER' ? 'number' : 'text'"
                                                                :rules="validarPregunta(pregunta)" />
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- RADIO -->
                                                <template v-else-if="pregunta.tipoControl === 'radio'">

                                                    <div class="ficha-campo">
                                                        <div class="ficha-label">
                                                            {{ pregunta.pregunta }}
                                                            <span v-if="pregunta.obligatoria === 1" class="ficha-obligatorio">*</span>
                                                        </div>
                                                        <div class="ficha-input" :class="{ 'modo-visualizacion': esVisualizacion }">
                                                            <template v-if="esVisualizacion && pregunta.respuesta">
                                                                <span class="ficha-valor">{{ pregunta.respuesta }}</span>
                                                            </template>
                                                            <q-option-group v-else
                                                                :value="pregunta.respuesta"
                                                                @input="val => $set(pregunta, 'respuesta', val)"
                                                                :options="pregunta.opciones" type="radio" inline
                                                                :disable="esVisualizacion"
                                                                :rules="pregunta.obligatoria ? [val => !!val || 'Debe seleccionar una opción'] : []" />
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- PREGUNTA 2 -->
                                                <template v-if="mostrarPregunta2(pregunta)">
                                                    <div class="ficha-campo ficha-pregunta2">
                                                        <div class="ficha-label">
                                                            {{ pregunta.pregunta2 }}
                                                            <span v-if="pregunta.obligatoria2 === 1" class="ficha-obligatorio">*</span>
                                                        </div>
                                                        <div class="ficha-input" :class="{ 'modo-visualizacion': esVisualizacion }">
                                                            <!-- TEXT -->
                                                            <template v-if="esVisualizacion">
                                                                <span class="ficha-valor">{{ pregunta.respuesta2 || '—' }}</span>
                                                            </template>
                                                            <template v-else>
                                                                <q-input v-if="pregunta.tipoControl2 === 'text'" outlined dense
                                                                    v-model="pregunta.respuesta2" :disable="esVisualizacion"
                                                                    :type="pregunta.tipoDato2 === 'NUMBER' ? 'number' : 'text'"
                                                                    :rules="validarPregunta2(pregunta)" />

                                                                <q-select v-if="pregunta.tipoControl2 === 'select'" outlined
                                                                    dense v-model="pregunta.respuesta2"
                                                                    :options="pregunta.opciones2" emit-value map-options
                                                                    :disable="esVisualizacion" />
                                                            </template>
                                                        </div>
                                                    </div>
                                                </template>




                                            </div>



                                        </div>
                                    </q-expansion-item>

                                    <div v-if="mostrarTotales" class="totales-container">
                                        <div class="totales-header">
                                            <div class="text-weight-bold">RESUMEN DE EVALUACIÓN</div>
                                        </div>
                                        <div class="totales-row conforme">
                                            <div class="text-bold">CONFORME</div>
                                            <div class="text-right">{{ totalesRespuestas.CONFORME }}</div>
                                        </div>
                                        <div class="totales-row no-conforme">
                                            <div class="text-bold">NO CONFORME</div>
                                            <div class="text-right">{{ totalesRespuestas.NO_CONFORME }}</div>
                                        </div>
                                        <div class="totales-row observacion">
                                            <div class="text-bold">OBSERVACIÓN</div>
                                            <div class="text-right">{{ totalesRespuestas.OBSERVACION }}</div>
                                        </div>
                                        <div class="totales-row no-aplica">
                                            <div class="text-bold">NO APLICA</div>
                                            <div class="text-right">{{ totalesRespuestas.NO_APLICA }}</div>
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
                        <q-card-actions class="ficha-footer" align="center">

                            <q-btn v-if="!esVisualizacion" label="Guardar" icon="save" type="submit" @click="guardarTodo" class="ficha-btn-guardar" />
                            <q-btn label="Cancelar" v-close-popup class="ficha-btn-cancelar" style="min-width: 70px;" />
                        </q-card-actions>
                    </div>
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
                                <q-td :props="props">
                                    <q-btn label="Seleccionar" class="btn-inabif" size="sm"
                                        @click="seleccionarCentro(props.row)" />
                                </q-td>
                            </template>

                        </q-table>

                    </q-card-section>

                </q-card>
            </q-dialog>

            <!-- DIALOGO SUPERVISADOS -->
            <q-dialog v-model="dialogSupervisados" persistent>
                <q-card style="width: 700px; max-width: 90vw">
                    <q-card-section class="bg-header-dialog">
                        <span style="float: right;">
                            <q-btn icon="close" v-close-popup flat round size="sm"></q-btn>
                        </span>
                        <div class="text-body2 text-bold">SELECCIONAR SUPERVISADOS</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input dense outlined debounce="300" v-model="filtroSupervisados"
                            placeholder="Buscar por nombre..." clearable class="q-mb-md">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>

                        <q-table :data="trabajadoresCentro" :columns="columnasSupervisados"
                            row-key="idPersonal" table-header-class="bg-inabif text-bold" dense flat bordered
                            :filter="filtroSupervisados" selection="multiple"
                            :selected.sync="selectedSupervisados"
                            :rows-per-page-options="[10, 20, 50]">
                            <template v-slot:body-cell-nro="props">
                                <q-td :props="props">
                                    {{ props.rowIndex + 1 }}
                                </q-td>
                            </template>
                        </q-table>
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn label="Cancelar" v-close-popup flat />
                        <q-btn label="Confirmar" color="primary" @click="confirmarSupervisados" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!-- DIALOGO VALIDAR FICHA -->
            <q-dialog v-model="dialogValidarFicha" persistent @hide="resetValidacion">
                <q-card style="width: 700px; max-width: 90vw">
                    <q-card-section class="bg-header-dialog">
                        <span style="float: right;">
                            <q-btn icon="close" v-close-popup flat round size="sm"></q-btn>
                        </span>
                        <div class="text-body2 text-bold">VALIDAR FICHA</div>
                        <div class="text-caption" v-if="fichaAValidar">
                            {{ fichaAValidar.codigoAnexo2 }} - Correlativo: {{ fichaAValidar.correlativo }}
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div v-if="loadingCargarPersonal" class="text-center q-pa-lg">
                            <q-spinner size="40px" color="primary" />
                            <div class="q-mt-sm text-grey">Cargando personal...</div>
                        </div>
                        <q-table 
                            v-else
                            :data="personalValidacion" 
                            :columns="columnasValidacion"
                            row-key="idPersonal" 
                            table-header-class="bg-inabif text-bold" 
                            dense flat bordered
                            class="tabla-validar-ficha"
                            :rows-per-page-options="[0]"
                            hide-bottom>
                            
                            <template v-slot:body-cell-nro="props">
                                <q-td :props="props">
                                    {{ props.rowIndex + 1 }}
                                </q-td>
                            </template>

                            <template v-slot:body-cell-validar="props">
                                <q-td :props="props">
                                    <!-- Ya validado -->
                                    <div v-if="props.row.validado" class="row justify-center items-center">
                                        <q-icon name="verified_user" color="positive" size="28px">
                                            <q-tooltip>Validado</q-tooltip>
                                        </q-icon>
                                    </div>
                                    <!-- Mostrar input -->
                                    <div v-else-if="mostrarInputValidar[props.row.idPersonal]" class="row q-gutter-xs items-center justify-center">
                                        <q-input 
                                            v-model="props.row.contrasena" 
                                            type="password" 
                                            outlined dense 
                                            placeholder="Ingrese contraseña"
                                            class="input-validar"
                                            :disable="props.row.validando"
                                            @keyup.enter="validarPersonal(props.row)">
                                            <template v-slot:append>
                                                <q-btn 
                                                    round dense flat
                                                    icon="check"
                                                    color="positive"
                                                    :loading="props.row.validando"
                                                    :disable="!props.row.contrasena"
                                                    @click="validarPersonal(props.row)" />
                                            </template>
                                        </q-input>
                                        <q-btn 
                                            round dense flat
                                            icon="close"
                                            color="grey"
                                            size="sm"
                                            @click="$set(mostrarInputValidar, props.row.idPersonal, false)" />
                                    </div>
                                    <!-- Botón para mostrar input -->
                                    <div v-else class="row justify-center items-center">
                                        <q-btn 
                                            round
                                            color="inabif"
                                            text-color="white"
                                            icon="verified_user"
                                            size="sm"
                                            @click="$set(mostrarInputValidar, props.row.idPersonal, true)">
                                            <q-tooltip>Validar personal</q-tooltip>
                                        </q-btn>
                                    </div>
                                </q-td>
                            </template>

                            <template v-slot:no-data>
                                <div class="full-width row flex-center q-pa-md text-grey">
                                    No se encontró personal para validar
                                </div>
                            </template>
                        </q-table>
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn label="Cerrar" v-close-popup flat />
                        <q-btn 
                            label="Dar Conformidad" 
                            class="btn-inabif" 
                            :loading="validandoConformidad"
                            :disable="!todosValidados"
                            @click="darConformidad" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!-- DIALOGO GESTION DE AUDIOS -->
            <q-dialog v-model="dialogAudios" persistent @hide="limpiarAudioDialog">
                <q-card style="width: 700px; max-width: 90vw">
                    <q-card-section class="bg-header-dialog">
                        <span style="float: right;">
                            <q-btn icon="close" v-close-popup flat round size="sm"></q-btn>
                        </span>
                        <div class="text-body2 text-bold">GESTIÓN DE AUDIOS</div>
                        <div class="text-caption" v-if="audioRow">
                            {{ audioRow.codigoAnexo2 }} - Correlativo: {{ audioRow.correlativo }}
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <!-- Zona de subida / reemplazo -->
                        <div class="row q-col-gutter-sm items-center q-mb-md">
                            <div class="col">
                                <q-file
                                    v-model="audioFile"
                                    label="Seleccionar audio"
                                    outlined
                                    dense
                                    accept="audio/*"
                                    clearable
                                    :disable="loadingAudios"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="attach_file" />
                                    </template>
                                </q-file>
                            </div>
                            <div class="col-auto">
                                <q-btn
                                    v-if="!audioReemplazando"
                                    label="Subir"
                                    icon="upload"
                                    class="btn-inabif"
                                    size="sm"
                                    :loading="loadingAudios"
                                    :disable="!audioFile"
                                    @click="subirAudio"
                                />
                                <q-btn
                                    v-else
                                    label="Reemplazar"
                                    icon="swap_horiz"
                                    class="btn-inabif"
                                    size="sm"
                                    :loading="loadingAudios"
                                    :disable="!audioFile"
                                    @click="subirAudio"
                                />
                            </div>
                            <div class="col-auto" v-if="audioReemplazando">
                                <q-btn
                                    label="Cancelar"
                                    icon="close"
                                    flat
                                    size="sm"
                                    color="grey"
                                    @click="cancelarReemplazo"
                                />
                            </div>
                        </div>

                        <div v-if="audioReemplazando" class="text-caption text-grey q-mb-sm">
                            Reemplazando: <strong>{{ audioReemplazando.nombreArchivo }}</strong>
                        </div>

                        <!-- Tabla de audios -->
                        <q-table
                            :data="audiosList"
                            :columns="columnasAudios"
                            row-key="idAudio"
                            table-header-class="bg-inabif text-bold"
                            dense flat bordered
                            :loading="loadingAudios"
                            :rows-per-page-options="[10, 20, 50]"
                        >
                            <template v-slot:body-cell-nro="props">
                                <q-td :props="props">
                                    {{ props.rowIndex + 1 }}
                                </q-td>
                            </template>

                            <template v-slot:body-cell-acciones="props">
                                <q-td :props="props">
                                    <q-btn icon="play_circle" color="primary" flat round size="sm" @click="reproducirAudio(props.row)">
                                        <q-tooltip>Reproducir</q-tooltip>
                                    </q-btn>
                                    <q-btn icon="edit" color="warning" flat round size="sm" @click="iniciarReemplazo(props.row)">
                                        <q-tooltip>Reemplazar</q-tooltip>
                                    </q-btn>
                                    <q-btn icon="delete" color="negative" flat round size="sm" @click="eliminarAudio(props.row)">
                                        <q-tooltip>Eliminar</q-tooltip>
                                    </q-btn>
                                </q-td>
                            </template>

                            <template v-slot:no-data>
                                <div class="full-width row flex-center q-pa-md text-grey">
                                    No hay audios registrados
                                </div>
                            </template>
                        </q-table>

                        <!-- Reproductor -->
                        <div v-if="audioBlobUrl" class="q-mt-md">
                            <audio controls :src="audioBlobUrl" type="audio/mpeg" style="width:100%; height: 40px; border-radius: 6px;"></audio>
                        </div>
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn label="Cerrar" v-close-popup flat />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>

    </template>

<style scoped>
.ficha-dialog {
    width: 95%;
    max-width: 900px;
    margin: 0 auto;
}

.ficha-scroll-wrapper {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
}

.tabla-scroll-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.tabla-scroll-container .q-markup-table {
    width: 100%;
    min-width: 500px;
}

.ficha-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
}

.ficha-titulo {
    font-size: clamp(0.9rem, 2.5vw, 1.25rem);
    word-wrap: break-word;
    overflow-wrap: anywhere;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
    font-weight: 600;
    color: #1a1a1a;
    padding-right: 8px;
}

.ficha-cerrar {
    flex-shrink: 0;
    margin-top: 2px;
}

.ficha-input .q-field,
.ficha-input .q-field.q-field--outlined,
.ficha-input .q-field.q-field--filled {
    border: none !important;
    box-shadow: none !important;
}

.ficha-pregunta {
    padding: 16px 0;
    border-bottom: 1px solid #e8e8e8;
    transition: background-color 0.15s ease;
}

.ficha-pregunta:hover {
    background-color: #fafbfc;
}

.ficha-pregunta:last-child {
    border-bottom: none;
}

.ficha-campo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

@media (min-width: 600px) {
    .ficha-campo {
        flex-direction: row;
        align-items: flex-start;
        gap: 16px;
    }
}

.ficha-label {
    flex: 0 0 auto;
    min-width: 150px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 1.5;
    padding-top: 8px;
}

@media (min-width: 600px) {
    .ficha-label {
        flex: 0 0 40%;
        max-width: 40%;
    }
}

.ficha-input {
    flex: 1;
    min-width: 0;
}

.ficha-input .q-field__control {
    border-radius: 6px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ficha-input .q-field__control:hover {
    border-color: #bf0411;
}

.ficha-input .q-field--focused .q-field__control {
    border-color: #bf0411;
    box-shadow: 0 0 0 3px rgba(191, 4, 17, 0.12);
}

.ficha-input.modo-visualizacion .q-field__control {
    background-color: #f9f9f9;
    border-color: #e0e0e0;
}

.ficha-input.modo-visualizacion .q-field__control::before {
    border-color: #e0e0e0;
}

.ficha-input.modo-visualizacion .q-field__control::after {
    display: none;
}

.ficha-valor {
    display: block;
    padding: 10px 12px;
    background-color: #f5f5f5;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    color: #333;
    font-size: 0.95rem;
    line-height: 1.5;
    min-height: 40px;
}

.ficha-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.ficha-tag {
    display: inline-block;
    padding: 6px 12px;
    background-color: #e8f4fd;
    color: #0277bd;
    border-radius: 16px;
    font-size: 0.85rem;
    font-weight: 500;
}

.ficha-pregunta2 {
    margin-top: 8px;
    padding-left: 16px;
    border-left: 3px solid #BF0411;
}

.pregunta-label {
    background-color: #e8f4fd;
    padding: 16px;
    margin: 16px 0 12px 0;
    border-radius: 6px;
    border-left: 4px solid #0288d1;
}

.pregunta-label .text-body2 {
    color: #01579b;
    font-weight: 600;
    font-size: 1rem;
}

.seccion-cabecera {
    background-color: #f5f7fa;
    border-radius: 6px;
    padding: 14px 16px;
    margin-bottom: 20px;
    border-left: 4px solid #BF0411;
}

.seccion-cabecera .col-12 {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.datos-generales-tabla tbody tr:nth-child(odd) {
    background-color: #fafbfc;
}

.datos-generales-tabla tbody tr:hover {
    background-color: #f0f4f8;
}

.datos-generales-tabla td:first-child {
    background-color: #DEE8F5;
    font-weight: 600;
    color: #1a1a1a;
    min-width: 200px;
}

.datos-generales-tabla .q-icon {
    color: #BF0411;
    margin-right: 8px;
}

.datos-generales-tabla td:last-child {
    padding-left: 16px;
}

.datos-generales-tabla .q-field,
.datos-generales-tabla .q-input,
.datos-generales-tabla .q-select {
    width: 100%;
}

.seccion-expansion {
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.seccion-expansion .q-expansion-item__content {
    border-left: 4px solid #BF0411;
}

.header-seccion {
    background: linear-gradient(135deg, #BF0411 0%, #d63031 100%);
}

.header-seccion:hover {
    background: linear-gradient(135deg, #a3030f 0%, #c0392b 100%);
}

.q-expansion-item__content {
    padding: 20px;
}

.totales-container {
    background-color: #fafbfc;
    border-radius: 8px;
    padding: 20px;
    margin-top: 24px;
    border: 1px solid #e0e0e0;
}

.totales-header {
    background: linear-gradient(135deg, #DEE8F5 0%, #c8d6e5 100%);
    padding: 14px 20px;
    border-radius: 6px 6px 0 0;
    margin: -20px -20px 20px -20px;
    border-bottom: 2px solid #BF0411;
}

.totales-header .text-weight-bold {
    color: #1a1a1a;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.totales-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 6px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.totales-row:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.totales-row.conforme {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
}

.totales-row.no-conforme {
    background-color: #f8d7da;
    border-left: 4px solid #dc3545;
}

.totales-row.observacion {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
}

.totales-row.no-aplica {
    background-color: #e9ecef;
    border-left: 4px solid #6c757d;
}

.totales-row .text-right {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a1a1a;
}

.q-field--disabled {
    opacity: 0.7;
}

.q-field--disabled .q-field__control {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.q-radio__inner--truthy {
    color: #BF0411;
}

.q-option-group .q-radio {
    margin-right: 16px;
}

.q-option-group .q-radio:hover .q-radio__inner {
    color: #d63031;
}

@media (max-width: 599px) {
    .ficha-label {
        font-size: 0.9rem;
        padding-top: 0;
        margin-bottom: 4px;
    }
    
    .ficha-pregunta {
        padding: 12px 0;
    }
    
    .ficha-valor {
        font-size: 0.9rem;
        padding: 8px 10px;
    }
    
    .ficha-input .q-field {
        min-height: 48px;
    }
    
    .ficha-input .q-field__control {
        min-height: 40px;
    }
    
    .ficha-dialog {
        width: 100%;
        max-width: 100%;
        margin: 0;
        border-radius: 0;
    }

    .ficha-scroll-wrapper {
        max-height: 100vh;
    }

    .tabla-scroll-container .q-markup-table {
        min-width: 0;
    }

    .datos-generales-tabla tbody tr {
        display: block;
        border-bottom: 1px solid #e6ecf2;
        padding: 8px 0;
    }

    .datos-generales-tabla tbody td {
        display: block;
        width: 100%;
        padding: 8px 10px !important;
        white-space: normal;
        text-align: left;
    }

    .datos-generales-tabla td:first-child {
        min-width: 0;
        font-weight: 700;
        color: #34495e;
        padding-bottom: 4px !important;
    }

    .datos-generales-tabla td:last-child {
        padding-left: 10px !important;
        padding-top: 2px !important;
    }
    
    .seccion-expansion .q-expansion-item__content {
        padding: 12px;
    }
    
    .totales-row {
        padding: 10px 12px;
    }
    
    .totales-row .text-right {
        font-size: 1rem;
    }
}

.q-markup-table {
    font-size: 0.95rem;
}

.q-markup-table td {
    padding: 12px 16px;
    vertical-align: top;
}

.q-input, .q-select {
    min-height: 42px;
}

.q-input .q-field__control, .q-select .q-field__control {
    min-height: 40px;
    height: 40px;
}

.q-input input, .q-select .q-field__input {
    padding: 8px 0;
}

/* Datos Generales - quitar bordes dobles */
.datos-generales-tabla .q-field,
.datos-generales-tabla .q-field.q-field--outlined,
.datos-generales-tabla .q-field.q-field--filled {
    border: none !important;
    box-shadow: none !important;
}

.datos-generales-tabla .q-field__control {
    border: none !important;
    box-shadow: none !important;
}

/* Focus visible para accesibilidad */
.ficha-input .q-field--focused .q-field__control {
    outline: 2px solid #BF0411;
    outline-offset: 2px;
}

.ficha-input .q-radio--focused .q-radio__inner {
    outline: 2px solid #BF0411;
    outline-offset: 2px;
}

/* Hover en radios */
.q-radio:hover .q-radio__inner:not(.q-radio__inner--truthy) {
    color: #d63031;
}

.q-radio__inner--truthy {
    color: #BF0411 !important;
}

/* Separación entre secciones */
.seccion-expansion {
    margin-bottom: 24px;
}

/* Barra para botón PDF */
.ficha-pdf-bar {
    background-color: #f0f4f8;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
}

/* Audio player estilizado */
audio {
    width: 100%;
    border-radius: 6px;
    margin-top: 8px;
    height: 40px;
}

/* Footer del diálogo */
.ficha-footer {
    border-top: 1px solid #e0e0e0;
    padding: 16px 24px;
    background-color: #fafbfc;
}

.ficha-btn-guardar {
    min-width: 120px;
}

.ficha-btn-cancelar {
    min-width: 100px;
}

.ficha-obligatorio {
    color: #BF0411;
    margin-left: 4px;
    font-weight: 700;
}

/* Scrollbar estilizado - vertical (body) */
.ficha-body::-webkit-scrollbar {
    width: 8px;
}

.ficha-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.ficha-body::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 4px;
}

.ficha-body::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
}

/* Scrollbar estilizado - horizontal (wrapper) */
.ficha-scroll-wrapper::-webkit-scrollbar {
    height: 8px;
}

.ficha-scroll-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.ficha-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 4px;
}

.ficha-scroll-wrapper::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
}

.select-option-img {
    width: 26px;
    height: 26px;
    object-fit: contain;
    margin-right: 8px;
    vertical-align: middle;
}

/* Layout fijo solo para tabla de anexos */
.tabla-anexos .q-table {
    table-layout: fixed;
    width: 100%;
}

.tabla-anexos .q-table th,
.tabla-anexos .q-table td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Truncado con ellipsis para celdas de texto */
.ellipsis-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Ellipsis dentro de slots personalizados */
.q-td .ellipsis {
    width: 100%;
    display: block;
}

.chip-estado {
    font-weight: 700;
    letter-spacing: 0.2px;
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
}

.chip-estado .q-chip__icon {
    font-size: 16px;
}

.chip-estado--1 {
    background: linear-gradient(135deg, #1faa59 0%, #2ecc71 100%);
}

.chip-estado--2 {
    background: linear-gradient(135deg, #1565c0 0%, #1e88e5 100%);
}

.chip-estado--0 {
    background: linear-gradient(135deg, #c62828 0%, #ef5350 100%);
}

/* ================================
   ESTILOS TABLA VALIDAR FICHA
   ================================ */

.tabla-validar-ficha .q-table {
    table-layout: fixed;
    width: 100%;
}

.tabla-validar-ficha .q-table th {
    background: linear-gradient(135deg, #BF0411 0%, #d63031 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8rem;
    padding: 12px 16px;
}

.tabla-validar-ficha .q-table td {
    padding: 12px 16px;
    vertical-align: middle;
}

.tabla-validar-ficha .q-table tbody tr:nth-child(even) {
    background-color: #fafbfc;
}

.tabla-validar-ficha .q-table tbody tr:hover {
    background-color: #f0f4f8;
}

/* Input de validación estilizado */
.input-validar .q-field__control {
    border-radius: 20px;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    padding-right: 4px;
}

.input-validar .q-field__control:hover {
    border-color: #BF0411;
}

.input-validar.q-field--focused .q-field__control {
    border-color: #BF0411;
    box-shadow: 0 0 0 3px rgba(191, 4, 17, 0.12);
}

.input-validar input {
    font-size: 0.9rem;
}

/* Botón circular de validar */
.btn-validar-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 50%;
    padding: 0;
}
</style>

<script>


import axios from "axios";
import { IMAGE_MAP } from "src/constants/image-map.constant";
import { normalizeTextSpacing } from "src/utils/normalize-text-spacing.util";

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
                { id: null, anio: 'TODOS' }
            ],
            modoSupervision: null,
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
                { id: null, nombreTipo: 'TODOS' }
            ],
            estadosMap: {
                1: { label: 'REGISTRADO', color: 'positive', textColor: 'white', icon: 'check_circle' },
                2: { label: 'SUSCRITO', color: 'info', textColor: 'white', icon: 'verified' },
                0: { label: 'ANULADO',    color: 'negative', textColor: 'white', icon: 'cancel' }
            },
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
                idsSupervisados: []

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
            anexosRaw: [],

            columnasTableAnexos: [
                {
                    name: "idAnexoCabecera",
                    label: "ID",
                    field: "idAnexoCabecera",
                    format: (val) => String(val).padStart(5, '0'),
                    align: "center",
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
                    style: "width: 70px; min-width: 70px; max-width: 70px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "periodo",
                    label: "PERIODO",
                    field: "periodo",
                    align: "center",
                    sortable: true,
                    style: "width: 100px; min-width: 100px; max-width: 100px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "tipo",
                    label: "TIPO",
                    field: "tipo",
                    align: "center",
                    sortable: true,
                    style: "width: 120px; min-width: 120px; max-width: 120px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "nombreUnidad",
                    label: "UNIDAD",
                    field: "nombreUnidad",
                    align: "center",
                    sortable: true,
                    style: "width: 130px; min-width: 130px; max-width: 130px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "nombreServicio",
                    label: "SERVICIO",
                    field: "nombreServicio",
                    align: "left",
                    sortable: true,
                    style: "width: 180px; min-width: 180px; max-width: 180px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "nombreCentro",
                    label: "CENTRO",
                    field: "nombreCentro",
                    align: "center",
                    sortable: true,
                    style: "width: 130px; min-width: 130px; max-width: 130px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "codigoAnexo2",
                    label: "CÓDIGO",
                    field: "codigoAnexo2",
                    align: "center",
                    sortable: true,
                    style: "width: 100px; min-width: 100px; max-width: 100px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "nombreAnexo",
                    label: "INSTRUMENTO",
                    field: "nombreAnexo",
                    align: "left",
                    sortable: true,
                    style: "width: 300px; min-width: 300px; max-width: 300px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "correlativo",
                    label: "CORRELATIVO",
                    field: "correlativo",
                    align: "center",
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
                    style: "width: 100px; min-width: 100px; max-width: 100px;",
                    classes: "ellipsis-cell"
                },
                {
                    name: "estado",
                    label: "ESTADO",
                    field: "estado",
                    align: "center",
                    sortable: true,
                    sort: (a, b) => {
                        const map = { 1: 'REGISTRADO', 2: 'SUSCRITO', 0: 'ANULADO' };
                        return (map[a] || '').localeCompare(map[b] || '');
                    },
                    style: "width: 130px; min-width: 130px; max-width: 130px;"
                },
                {
                    name: "acciones",
                    label: "ACCIONES",
                    field: "acciones",
                    align: "center",
                    style: "width: 80px; min-width: 80px; max-width: 80px;"
                }
            ],
            dialogCentros: false,
            loadingCentros: false,
            centroNombre: "",

            dialogSupervisados: false,
            selectedSupervisados: [],
            filtroSupervisados: "",

            columnasSupervisados: [
                {
                    name: "nro",
                    label: "N°",
                    field: "nro",
                    align: "center",
                    sortable: false,
                    style: "width: 50px;"
                },
                {
                    name: "nombre",
                    label: "NOMBRE",
                    field: "nombre",
                    align: "left",
                    sortable: true
                }
            ],

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

            dialogValidarFicha: false,
            fichaAValidar: null,
            personalValidacion: [],
            columnasValidacion: [
                {
                    name: "nro",
                    label: "N°",
                    field: "nro",
                    align: "center",
                    sortable: false,
                    style: "width: 50px;"
                },
                {
                    name: "nombre",
                    label: "PERSONAL (NOMBRES)",
                    field: "nombre",
                    align: "left",
                    sortable: true
                },
                {
                    name: "validar",
                    label: "VALIDAR",
                    field: "validar",
                    align: "center",
                    style: "width: 280px;"
                }
            ],
            validandoConformidad: false,
            loadingCargarPersonal: false,
            mostrarInputValidar: {},

            dialogAudios: false,
            audioRow: null,
            audiosList: [],
            loadingAudios: false,
            audioFile: null,
            audioBlobUrl: null,
            audioReemplazando: null,
            fichaPeriodo: null,
            fichaTipo: null,
            columnasAudios: [
                { name: "nro", label: "N°", field: "nro", align: "center", sortable: false, style: "width: 50px;" },
                { name: "nombreArchivo", label: "NOMBRE DE ARCHIVO", field: "nombreArchivo", align: "left", sortable: true },
                { name: "acciones", label: "ACCIONES", field: "acciones", align: "center", style: "width: 180px;" }
            ]

        }
    },
    methods: {

        getOptionImage(pregunta, optOrIndex) {
            if (!pregunta || !pregunta.idPregunta || !pregunta.opciones) return null;
            let indexItem;
            if (typeof optOrIndex === 'number') {
                indexItem = optOrIndex;
            } else if (optOrIndex && optOrIndex.value !== undefined) {
                indexItem = pregunta.opciones.findIndex(o => o.value === optOrIndex.value) + 1;
            } else {
                return null;
            }
            if (indexItem <= 0) return null;
            const key = `${pregunta.idPregunta}-${indexItem}`;
            return IMAGE_MAP[key] || null;
        },

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
                await this.precargarTrabajadoresCentro();
                this.form.respDirector = row.respDirector;
                this.form.idDirector = row.idDirector;
                this.form.idRespSupervision = row.idRespSupervision;
                this.form.idsSupervisados = this.parseIdSupervisado(row.idSupervisado);

                this.form.tipoCentro = row.tipoCentro;

                // Capturar periodo y tipo desde la fila para modo edición
                this.fichaPeriodo = row.periodo;
                this.fichaTipo = row.tipo;

                // Marcar modo edición
                this.modoEdicion = true;

                // Cerrar acordeón
                this.seccionAbierta = null;

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
                await this.precargarTrabajadoresCentro();
                this.form.respDirector = row.respDirector;
                this.form.idRespSupervision = row.idRespSupervision;
                this.form.idsSupervisados = this.parseIdSupervisado(row.idSupervisado);
                this.form.tipoCentro = row.tipoCentro;

                // Capturar periodo y tipo desde la fila para modo visualización
                this.fichaPeriodo = row.periodo;
                this.fichaTipo = row.tipo;

                this.modoEdicion = false;
                this.modoVisualizacion = true;

                // Cerrar acordeón
                this.seccionAbierta = null;

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
                this.form.idsSupervisados = this.parseIdSupervisado(data.idSupervisado);

                if (data.idSupervisado && data.nombreSupervisado) {
                    const ids = this.parseIdSupervisado(data.idSupervisado);
                    ids.forEach(id => {
                        const existe = this.trabajadoresCentro.find(x => x.idPersonal === id);
                        if (!existe) {
                            this.trabajadoresCentro.push({
                                idPersonal: String(id),
                                nombre: data.nombreSupervisado
                            });
                        }
                    });
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
                this.anexosRaw = res.data.data || res.data

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
            this.seccionAbierta = null;

            // Capturar periodo y tipo desde los combos de la pantalla principal
            this.fichaPeriodo = this.anioSeleccionado;
            this.fichaTipo = this.tipoFicha;
            this.modoSupervision = null;
            if (!this.anioSeleccionado) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: PERIODO'
                })
                return
            }

            if (!this.tipoFicha) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: TIPO'
                })
                return
            }

            if (!this.unidadSeleccionada) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: UNIDAD'
                })
                return
            }

            if (!this.servicioSeleccionado) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: SERVICIO'
                })
                return
            }

            if (!this.centroSeleccionado) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: ESPACIO DE INTERVENCIÓN'
                })
                return
            }

            if (!this.anexoSeleccionado) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Debe seleccionar: INSTRUMENTO'
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
            this.form.idsSupervisados = []

            // Precargar todo el personal del centro
            this.precargarTrabajadoresCentro()

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
                idsSupervisados: []
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
                            condicion: this.parseCondicion(p.condicion),
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

                    // Inicializar respuesta2 según tipoControl2
                    let respuesta2 = null
                    switch (p.tipoControl2) {
                        case 'text':
                            respuesta2 = ''
                            break
                        case 'select':
                        case 'radio':
                            respuesta2 = null
                            break
                        case 'selectM':
                            respuesta2 = []
                            break
                        default:
                            respuesta2 = null
                            break
                    }

                    seccionActual.preguntas.push({
                        ...p,

                        tipoDato1: p.tipoDato1,
                        tipoDato2: p.tipoDato2,

                        obligatoria: Number(p.obligatoria ?? 0),
                        obligatoria2: Number(p.obligatoria2 ?? 0),

                        respuesta,
                        respuesta2,

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

                // limpiar respuestas ocultas solo en modo NUEVO
                this.limpiarRespuestasOcultas()
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
                            respuesta2: (() => {
                                // OTRO en pregunta2 (si aplica)
                                if (p.respuesta2 === 'OTRO' || p.respuesta2 === 'OTROS') {
                                    return p.otroTexto2 || p.respuesta2
                                }
                                return p.respuesta2 ?? null
                            })(),

                            observacion: null,
                            puntaje: null

                        }))
                );

                const payload = {
                    idAnexo: this.form.idAnexo,
                    idCentro: this.form.idCentro,
                    correlativo: this.form.correlativo,
                    periodo: this.fichaPeriodo,
                    tipo: this.fichaTipo,
                    fechaAplicacion: new Date().toISOString().split('T')[0],
                    fechaRegistro: this.form.fechaRegistro,
                    idRespSupervision: this.form.idRespSupervision,
                    idDirector: this.form.idDirector,
                    idSupervisado: this.form.idsSupervisados.join(','),
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

                    // Resetear validaciones previas al editar
                    try {
                        await this.$axios.delete(
                            `${process.env.API_URL_SIGESU}/resetValidacionAnexoCabecera?idAnexoCabecera=${this.form.idAnexoCabecera}`
                        );
                    } catch (resetError) {
                        console.error('Error al resetear validaciones:', resetError);
                    }

                } else {

                    payload.usuRegistra = parseInt(this.$q.localStorage.getItem('sgs-idUsuario'));

                    await this.$axios.post(
                        `${process.env.API_URL_SIGESU}/createAnexoCompleto`,
                        payload
                    );

                }

                this.$q.notify({
                    type: "positive",
                    message: this.modoEdicion ? "Actualizado correctamente. Las validaciones previas han sido reseteadas." : "Registrado correctamente"
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
                this.unidades.push({ idUnidad: null, nombreUnidad: 'TODOS' });
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
            this.seccionAbierta = null;
            this.modoSupervision = null;
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
        getAudioUrl(file) {
            return `${process.env.API_URL_SIGESU}/uploads/audios/${file}`;
        },

        abrirDialogAudios(row) {
            this.audioRow = row;
            this.dialogAudios = true;
            this.cargarAudios();
        },

        async cargarAudios() {
            if (!this.audioRow) return;
            this.loadingAudios = true;
            try {
                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/anexo-cabecera-audio/listar`,
                    {
                        params: { idAnexoCabecera: this.audioRow.idAnexoCabecera }
                    }
                );
                const data = res.data?.data || [];
                this.audiosList = data.map(item => ({
                    idAudio: item.ACA_ID_AUDIO,
                    nombreArchivo: item.ACA_NOMBRE_ARCHIVO,
                    estado: item.ACA_ESTADO
                }));
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al cargar audios" });
            } finally {
                this.loadingAudios = false;
            }
        },

        async subirAudio() {
            if (!this.audioFile) {
                this.$q.notify({ type: "warning", message: "Seleccione un archivo de audio" });
                return;
            }

            this.loadingAudios = true;
            try {
                const formData = new FormData();
                formData.append("audio", this.audioFile);

                if (this.audioReemplazando) {
                    formData.append("idAudio", this.audioReemplazando.idAudio);
                    formData.append("estado", 1);

                    await this.$axios.put(
                        `${process.env.API_URL_SIGESU}/anexo-cabecera-audio`,
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" }
                        }
                    );

                    this.$q.notify({ type: "positive", message: "Audio reemplazado correctamente" });
                    this.audioReemplazando = null;
                } else {
                    formData.append("idAnexoCabecera", this.audioRow.idAnexoCabecera);

                    await this.$axios.post(
                        `${process.env.API_URL_SIGESU}/anexo-cabecera-audio`,
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" }
                        }
                    );

                    this.$q.notify({ type: "positive", message: "Audio subido correctamente" });
                }

                this.audioFile = null;
                this.cargarAudios();
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al guardar el audio" });
            } finally {
                this.loadingAudios = false;
            }
        },

        iniciarReemplazo(row) {
            this.audioReemplazando = row;
            this.audioFile = null;
            this.$q.notify({ type: "info", message: `Seleccione el nuevo archivo para reemplazar: ${row.nombreArchivo}` });
        },

        cancelarReemplazo() {
            this.audioReemplazando = null;
            this.audioFile = null;
        },

        async eliminarAudio(row) {
            this.$q.dialog({
                title: "Confirmar eliminación",
                message: `¿Eliminar el audio <strong>${row.nombreArchivo}</strong>?`,
                html: true,
                cancel: true,
                persistent: true
            }).onOk(async () => {
                this.loadingAudios = true;
                try {
                    await this.$axios.delete(
                        `${process.env.API_URL_SIGESU}/anexo-cabecera-audio`,
                        {
                            params: { idAudio: row.idAudio }
                        }
                    );

                    this.$q.notify({ type: "positive", message: "Audio eliminado correctamente" });

                    if (this.audioReemplazando && this.audioReemplazando.idAudio === row.idAudio) {
                        this.audioReemplazando = null;
                        this.audioFile = null;
                    }

                    this.liberarAudioBlob();
                    this.cargarAudios();
                } catch (error) {
                    console.error(error);
                    this.$q.notify({ type: "negative", message: "Error al eliminar el audio" });
                } finally {
                    this.loadingAudios = false;
                }
            });
        },

        async reproducirAudio(row) {
            try {
                const res = await this.$axios.get(
                    `${process.env.API_URL_SIGESU}/anexo-cabecera-audio`,
                    {
                        params: {
                            idAnexoCabecera: this.audioRow.idAnexoCabecera,
                            idAudio: row.idAudio
                        },
                        responseType: "blob"
                    }
                );

                this.liberarAudioBlob();
                this.audioBlobUrl = window.URL.createObjectURL(res.data);
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al reproducir el audio" });
            }
        },

        liberarAudioBlob() {
            if (this.audioBlobUrl) {
                window.URL.revokeObjectURL(this.audioBlobUrl);
                this.audioBlobUrl = null;
            }
        },

        limpiarAudioDialog() {
            this.audioRow = null;
            this.audiosList = [];
            this.audioFile = null;
            this.audioReemplazando = null;
            this.liberarAudioBlob();
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
                    this.trabajadoresCentro = res.data.map(t => ({
                        ...t,
                        idPersonal: String(t.idPersonal)
                    }))
                })

            } catch (error) {
                console.error(error)
            }

        },
        parseIdSupervisado(idSupervisado) {
            if (!idSupervisado) return []
            if (Array.isArray(idSupervisado)) return idSupervisado.map(String)
            if (typeof idSupervisado === 'number') return [String(idSupervisado)]
            if (typeof idSupervisado === 'string') {
                return idSupervisado
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
            }
            return []
        },
        async precargarTrabajadoresCentro() {
            if (!this.form.nombreCentro) return
            try {
                const res = await this.$axios.get(
                    process.env.API_URL_SIGESU + "/responsables-centro",
                    {
                        params: {
                            nombreCentro: this.form.nombreCentro
                        }
                    }
                )
                this.trabajadoresCentro = res.data.map(t => ({
                    ...t,
                    idPersonal: String(t.idPersonal)
                }))
            } catch (error) {
                console.error(error)
            }
        },
        abrirDialogSupervisados() {
            this.selectedSupervisados = []
            this.filtroSupervisados = ''
            // Pre-seleccionar los ya elegidos
            this.selectedSupervisados = this.trabajadoresCentro.filter(
                t => this.form.idsSupervisados.includes(t.idPersonal)
            )
            this.dialogSupervisados = true
        },
        confirmarSupervisados() {
            const nuevosIds = this.selectedSupervisados.map(s => s.idPersonal)
            // Fusionar sin duplicados
            this.form.idsSupervisados = [...new Set([
                ...this.form.idsSupervisados,
                ...nuevosIds
            ])]
            this.dialogSupervisados = false
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
        limpiarRespuestasOcultas() {
            if (this.modo !== 'nuevo') return

            this.secciones.forEach(sec => {
                sec.preguntas.forEach(p => {
                    if (!this.mostrarPregunta(p)) {
                        switch (p.tipoControl) {
                            case 'text':    p.respuesta = ''; break
                            case 'selectM': p.respuesta = []; break
                            case 'label':   p.respuesta = 2; break
                            default:        p.respuesta = null; break
                        }
                    }
                    if (!this.mostrarPregunta2(p)) {
                        p.respuesta2 = null
                    }
                })
            })
        },

        mostrarPregunta2(pregunta) {
            if (!pregunta.pregunta2) return false

            const resp = pregunta.respuesta
            if (!resp) {
                if (this.modo === 'nuevo') this.$set(pregunta, 'respuesta2', null)
                return false
            }

            const cond = pregunta.condicion
            if (!cond) return true

            if (cond.id) {
                const preguntaBase = this.buscarPregunta(cond.id)
                if (!preguntaBase || !preguntaBase.respuesta) {
                    if (this.modo === 'nuevo') this.$set(pregunta, 'respuesta2', null)
                    return false
                }

                const valorBase = preguntaBase.respuesta

                if (!isNaN(cond.valor)) {
                    const cumple = Number(valorBase) >= Number(cond.valor)
                    if (!cumple && this.modo === 'nuevo') this.$set(pregunta, 'respuesta2', null)
                    return cumple
                }

                const base = valorBase.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                const condValor = cond.valor.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

                const cumple = base === condValor
                if (!cumple && this.modo === 'nuevo') this.$set(pregunta, 'respuesta2', null)
                return cumple
            }

            const valor = resp.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const condValor = cond.valor?.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            const cumple = valor === condValor
            if (!cumple && this.modo === 'nuevo') this.$set(pregunta, 'respuesta2', null)
            return cumple
        },
        mostrarPregunta(pregunta) {

            if (!pregunta.condicion) return true

            const cond = pregunta.condicion

            // 🔴 si no tiene id → no es de este tipo
            if (!cond.id) return true

            const preguntaBase = this.buscarPregunta(cond.id)

            // Si la pregunta base no existe o no tiene respuesta válida, ocultar la condicional
            if (!preguntaBase) {
                if (this.modo === 'nuevo') {
                    switch (pregunta.tipoControl) {
                        case 'text':    this.$set(pregunta, 'respuesta', ''); break
                        case 'selectM': this.$set(pregunta, 'respuesta', []); break
                        case 'label':   this.$set(pregunta, 'respuesta', 2); break
                        default:        this.$set(pregunta, 'respuesta', null); break
                    }
                }
                return false
            }
            const baseRespuesta = preguntaBase.respuesta
            if (baseRespuesta === null || baseRespuesta === undefined || baseRespuesta === '') {
                if (this.modo === 'nuevo') {
                    switch (pregunta.tipoControl) {
                        case 'text':    this.$set(pregunta, 'respuesta', ''); break
                        case 'selectM': this.$set(pregunta, 'respuesta', []); break
                        case 'label':   this.$set(pregunta, 'respuesta', 2); break
                        default:        this.$set(pregunta, 'respuesta', null); break
                    }
                }
                return false
            }

            const valorBase = preguntaBase.respuesta

            // NUMÉRICO
            if (!isNaN(cond.valor)) {
                const cumple = Number(valorBase) >= Number(cond.valor)
                if (!cumple && this.modo === 'nuevo') {
                    switch (pregunta.tipoControl) {
                        case 'text':    this.$set(pregunta, 'respuesta', ''); break
                        case 'selectM': this.$set(pregunta, 'respuesta', []); break
                        case 'label':   this.$set(pregunta, 'respuesta', 2); break
                        default:        this.$set(pregunta, 'respuesta', null); break
                    }
                }
                return cumple
            }

            // TEXTO (soporta base simple, base array, condicion simple y condicion array)
            const cumple = this.normalizarCondicion(valorBase, cond.valor)
            if (!cumple && this.modo === 'nuevo') {
                switch (pregunta.tipoControl) {
                    case 'text':    this.$set(pregunta, 'respuesta', ''); break
                    case 'selectM': this.$set(pregunta, 'respuesta', []); break
                    case 'label':   this.$set(pregunta, 'respuesta', 2); break
                    default:        this.$set(pregunta, 'respuesta', null); break
                }
            }
            return cumple
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
        },

        async abrirDialogValidarFicha(row) {
            this.fichaAValidar = row;
            this.personalValidacion = [];
            this.mostrarInputValidar = {};
            this.loadingCargarPersonal = true;

            let idRespSupervision = row.idRespSupervision;
            let respSupervision = row.respSupervision;
            let idDirector = row.idDirector;
            let respDirector = row.respDirector;
            let idSupervisado = row.idSupervisado;
            let idsPersonalValida = [];

            // Si la tabla principal no trae los IDs de personal, los obtenemos del detalle
            if (!idRespSupervision || !respSupervision || !idDirector || !respDirector || !idSupervisado) {
                try {
                    const res = await this.$axios.get(
                        `${process.env.API_URL_SIGESU}/obtenerRespuestas`,
                        {
                            params: {
                                idAnexoCabecera: row.idAnexoCabecera,
                                correlativo: row.correlativo
                            }
                        }
                    );
                    const data = res.data?.data;
                    if (data) {
                        if (!idRespSupervision) idRespSupervision = data.idRespSupervision;
                        if (!respSupervision) respSupervision = data.respSupervision;
                        if (!idDirector) idDirector = data.idDirector;
                        if (!respDirector) respDirector = data.respDirector;
                        if (!idSupervisado) idSupervisado = data.idSupervisado;
                        if (data.idsPersonalValida) {
                            idsPersonalValida = String(data.idsPersonalValida)
                                .split(',')
                                .map(s => s.trim())
                                .filter(Boolean);
                        }
                    }
                } catch (error) {
                    console.error(error);
                    this.$q.notify({ type: "negative", message: "Error al obtener datos de la ficha" });
                    this.loadingCargarPersonal = false;
                    return;
                }
            }

            let trabajadores = [];
            try {
                const res = await this.$axios.get(
                    process.env.API_URL_SIGESU + "/responsables-centro",
                    { params: { nombreCentro: row.nombreCentro } }
                );
                const data = res.data?.data || res.data || [];
                trabajadores = Array.isArray(data) ? data.map(t => ({
                    ...t,
                    idPersonal: String(t.idPersonal)
                })) : [];
            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al cargar el personal del centro" });
            }

            const personal = [];

            // Responsable de supervisión
            if (idRespSupervision) {
                const idStr = String(idRespSupervision);
                const yaValidado = idsPersonalValida.includes(idStr);
                const encontrado = trabajadores.find(t => t.idPersonal === idStr);
                personal.push({
                    idPersonal: idStr,
                    nombre: respSupervision || (encontrado ? encontrado.nombre : `ID: ${idStr}`),
                    contrasena: '',
                    validado: yaValidado,
                    validando: false
                });
            }

            // Director
            if (idDirector) {
                const idStr = String(idDirector);
                const yaValidado = idsPersonalValida.includes(idStr);
                const encontrado = trabajadores.find(t => t.idPersonal === idStr);
                personal.push({
                    idPersonal: idStr,
                    nombre: respDirector || (encontrado ? encontrado.nombre : `ID: ${idStr}`),
                    contrasena: '',
                    validado: yaValidado,
                    validando: false
                });
            }

            // Supervisados
            const idsSupervisados = this.parseIdSupervisado(idSupervisado);
            idsSupervisados.forEach(id => {
                const yaValidado = idsPersonalValida.includes(id);
                const encontrado = trabajadores.find(t => t.idPersonal === id);
                personal.push({
                    idPersonal: id,
                    nombre: encontrado ? encontrado.nombre : `ID: ${id}`,
                    contrasena: '',
                    validado: yaValidado,
                    validando: false
                });
            });

            this.personalValidacion = personal;
            this.loadingCargarPersonal = false;

            if (personal.length === 0) {
                this.$q.notify({ type: "warning", message: "No se encontró personal para validar en esta ficha" });
            }

            this.dialogValidarFicha = true;
        },

        async validarPersonal(item) {
            if (!item.contrasena) {
                this.$q.notify({ type: "warning", message: "Ingrese la contraseña" });
                return;
            }

            item.validando = true;

            try {
                await this.$axios.patch(
                    `${process.env.API_URL_SIGESU}/validatePersonalAnexoCabecera?idAnexoCabecera=${this.fichaAValidar.idAnexoCabecera}&idPersonal=${item.idPersonal}&password=${encodeURIComponent(item.contrasena)}`
                );

                item.validado = true;
                item.contrasena = '';
                this.$set(this.mostrarInputValidar, item.idPersonal, false);
                this.$q.notify({ type: "positive", message: `${item.nombre} validado correctamente` });

            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: `Error al validar a ${item.nombre}` });
            } finally {
                item.validando = false;
            }
        },

        async darConformidad() {
            if (!this.todosValidados) {
                this.$q.notify({ type: "warning", message: "Faltan personal por validar" });
                return;
            }

            this.validandoConformidad = true;

            try {
                await this.$axios.patch(
                    `${process.env.API_URL_SIGESU}/saveConformidadAnexoCabecera?idAnexoCabecera=${this.fichaAValidar.idAnexoCabecera}&estado=2`
                );

                this.$q.notify({ type: "positive", message: "Ficha validada con conformidad" });
                this.dialogValidarFicha = false;
                this.cargarTablaAnexos();

            } catch (error) {
                console.error(error);
                this.$q.notify({ type: "negative", message: "Error al dar conformidad a la ficha" });
            } finally {
                this.validandoConformidad = false;
            }
        },

        resetValidacion() {
            this.fichaAValidar = null;
            this.personalValidacion = [];
            this.validandoConformidad = false;
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
        puedeCrearNuevo() {
            return !!this.anioSeleccionado &&
                !!this.tipoFicha &&
                !!this.unidadSeleccionada &&
                !!this.servicioSeleccionado &&
                !!this.centroSeleccionado &&
                !!this.anexoSeleccionado
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

        dataTableFiltrada() {
            // Si no hay ningun filtro activo, devolver todos los registros
            if (!this.anioSeleccionado && !this.tipoFicha && !this.unidadSeleccionada &&
                !this.servicioSeleccionado && !this.centroSeleccionado && !this.anexoSeleccionado) {
                return this.anexosRaw;
            }

            // Obtener nombres de los objetos seleccionados para comparacion exacta
            const unidad = this.unidades.find(u => u.idUnidad === this.unidadSeleccionada);
            const servicio = this.servicios.find(s => s.idServicio === this.servicioSeleccionado);
            const centro = this.centroSeleccionado;

            return this.anexosRaw.filter(row => {
                if (this.anioSeleccionado && row.periodo !== this.anioSeleccionado) return false;
                if (this.tipoFicha && row.tipo !== this.tipoFicha) return false;
                if (this.unidadSeleccionada && row.nombreUnidad !== (unidad?.nombreUnidad || '')) return false;
                if (this.servicioSeleccionado && row.nombreServicio !== (servicio?.nombreServicio || '')) return false;
                if (this.centroSeleccionado && row.nombreCentro !== (centro?.nombreUnidad || '')) return false;
                if (this.anexoSeleccionado && row.idAnexo !== this.anexoSeleccionado) return false;
                return true;
            });
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
        },

        todosValidados() {
            return this.personalValidacion.length > 0 
                && this.personalValidacion.every(p => p.validado === true);
        }

    }

}
</script>
