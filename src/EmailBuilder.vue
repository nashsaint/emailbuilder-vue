<template>
  <div class="eb">
    <!-- Toolbar -->
    <div class="toolbar">
      <button class="btn" @click="addBlock('heading')">Heading</button>
      <button class="btn" @click="addBlock('paragraph')">Paragraph</button>
      <button class="btn" @click="addBlock('image')">Image</button>
      <button class="btn" @click="addBlock('button')">Button</button>
      <button class="btn" @click="addBlock('divider')">Divider</button>
      <button class="btn" @click="addBlock('spacer')">Spacer</button>
      <button class="btn" @click="addBlock('columns2')">2 Columns</button>
      <div style="flex:1"></div>
      <button class="btn" @click="emit('update:modelValue', [])">Clear</button>
      <button class="btn primary" @click="doExport">Export HTML</button>
    </div>

    <div class="canvas">
      <!-- Block Library -->
      <section class="panel">
        <h3>Blocks</h3>
        <div class="body">
          <div v-for="(def, key) in BLOCKS"
     :key="key"
     class="block"
     draggable="true"
     @dragstart="onLibDragStart(key, $event)">
  {{ def.label }}
</div>

        </div>
      </section>

      <!-- Canvas -->
      <!-- Canvas -->
<section class="panel">
  <h3>Canvas</h3>
  <div class="body">
    <div
      class="dropzone"
      @dragover.stop.prevent="onCanvasDragOver"
      @drop.stop.prevent="onCanvasDrop"
      @dragenter.stop.prevent
      @dragleave="onCanvasDragLeave"
    >
      <template v-if="tree.length === 0">
        <p style="opacity:.7">Drag blocks here… or use the toolbar.</p>
        <div v-if="ghostIndex===0" class="ghost"></div>
      </template>

      <template v-for="(b, i) in tree" :key="b.id">
        <div v-if="ghostIndex===i" class="ghost"></div>

        <div
          class="block"
          :class="{ dragging: draggingId===b.id }"
          draggable="true"
          @dragstart="onBlockDragStart(b, $event)"
          @dragend="onDragEnd"
          @dragover.stop.prevent="onBlockDragOver(i, $event)"
          @mousedown.stop="select(b)"
          @click="select(b)"
        >
          <strong style="display:block;margin-bottom:.25rem">{{ labelOf(b.type) }}</strong>
          <small style="opacity:.7">{{ summarize(b) }}</small>
          <div class="controls" @mousedown.stop>
            <button class="btn" @click.stop="move(i, -1)" :disabled="i===0">↑</button>
            <button class="btn" @click.stop="move(i, 1)" :disabled="i===tree.length-1">↓</button>
            <button class="btn" @click.stop="removeAt(i)">✕</button>
          </div>
        </div>
      </template>

      <div v-if="tree.length && ghostIndex===tree.length" class="ghost"></div>
    </div>
  </div>
</section>


      <!-- Inspector -->
      <section class="panel">
        <h3>Inspector</h3>
        <div class="body" v-if="selected">
          <component
            :is="Inspectors[selected?.type] || FallbackInspector"
            :model="selected"
            @update="onInspectorUpdate"
          />

        </div>
        <div class="body" v-else>
          <p style="opacity:.7">Select a block to edit its properties.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import './emailbuilder.css'
import { reactive, watch, ref } from 'vue'
import { BLOCKS, newBlock } from './block.js'
import { renderDivTree } from './renderers/htmlDivRenderer.js'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  renderer: { type: String, default: 'div' } // 'div' | 'table' (future)
})
const emit = defineEmits(['update:modelValue', 'export'])

const tree = reactive(props.modelValue)
watch(
  () => props.modelValue,
  v => { if (v !== tree) { while (tree.length) tree.pop(); tree.push(...v) } }
)

// -------------------- DnD state --------------------
const draggingId = ref(null)          // id of a block while dragging
const dragPayload = ref(null)         // { type: 'lib'|'block', data }
const ghostIndex  = ref(-1)           // insertion index preview

// Per-block dragover: decide before/after using the block's midpoint
function onBlockDragOver(i, ev) {
  const r = ev.currentTarget.getBoundingClientRect()
  const mid = r.top + r.height / 2
  ghostIndex.value = ev.clientY < mid ? i : i + 1
  // signal accepted drop + UX
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = dragPayload.value?.type === 'block' ? 'move' : 'copy'
}

// Empty area dragover (fallback when not over a block)
function onCanvasDragOver(ev) {
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = dragPayload.value?.type === 'block' ? 'move' : 'copy'
  const dz = ev.currentTarget
  const blocks = Array.from(dz.querySelectorAll(':scope > .block'))
  ghostIndex.value = blocks.length ? tree.length : 0
}

// Dropzone leave: clear ghost if truly left
function onCanvasDragLeave(ev) {
  const related = ev.relatedTarget
  const dz = ev.currentTarget
  if (!dz.contains(related)) ghostIndex.value = -1
}

// Library item drag start (left panel)
function onLibDragStart(type, ev) {
  dragPayload.value = { type: 'lib', data: type }
  ev.dataTransfer.effectAllowed = 'copy'
  // Required by Firefox/Safari to initiate DnD
  ev.dataTransfer.setData('text/plain', `lib:${type}`)
}

// Existing block drag start (on canvas)
function onBlockDragStart(block, ev) {
  dragPayload.value = { type: 'block', data: block }
  draggingId.value = block.id
  ev.dataTransfer.effectAllowed = 'move'
  ev.dataTransfer.setData('text/plain', `block:${block.id}`)
}

// Drop handler: insert/move then clean up
function onCanvasDrop() {
  const idx = ghostIndex.value < 0 ? tree.length : ghostIndex.value
  const payload = dragPayload.value
  if (!payload) return

  if (payload.type === 'lib') {
    tree.splice(idx, 0, newBlock(payload.data))
  } else if (payload.type === 'block') {
    const from = tree.findIndex(x => x.id === payload.data.id)
    if (from !== -1) {
      const [item] = tree.splice(from, 1)
      const to = from < idx ? idx - 1 : idx
      tree.splice(to, 0, item)
    }
  }
  emit('update:modelValue', tree)
  // cleanup
  ghostIndex.value = -1
  draggingId.value = null
  dragPayload.value = null
}

function onDragEnd() {
  draggingId.value = null
  dragPayload.value = null
  ghostIndex.value = -1
}

// ------------------- Utilities --------------------
function addBlock(type) {
  tree.push(newBlock(type))
  emit('update:modelValue', tree)
}
function removeAt(i) { tree.splice(i, 1); emit('update:modelValue', tree) }
function move(i, delta) {
  const j = i + delta
  if (j < 0 || j >= tree.length) return
  const [item] = tree.splice(i, 1)
  tree.splice(j, 0, item)
  emit('update:modelValue', tree)
}
function labelOf(type) { return BLOCKS[type]?.label || type }
function summarize(b) {
  if (b.type === 'heading') return b.text
  if (b.type === 'paragraph') return `${b.text.slice(0, 40)}…`
  if (b.type === 'image') return b.src
  if (b.type === 'button') return `${b.text} → ${b.url}`
  if (b.type === 'divider') return `line ${b.thickness}px`
  if (b.type === 'spacer') return `${b.height}px`
  if (b.type === 'columns2') return 'two columns'
  return ''
}
const selected = ref(null)
function select(b) { selected.value = b }

// Inspector registry (inline components)
const InspectorHeading = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>Level</label><input type="text" v-model.number="model.level" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
}
const InspectorParagraph = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Text</label><textarea rows="6" v-model="model.text" @input="$emit('update')"></textarea>
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
}
const InspectorImage = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>URL</label><input type="url" v-model="model.src" @input="$emit('update')">
    <label>Alt</label><input type="text" v-model="model.alt" @input="$emit('update')">
    <label>Width</label><input type="text" v-model="model.width" @input="$emit('update')">
  </div>`
}
const InspectorButton = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>URL</label><input type="url" v-model="model.url" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
}
const InspectorDivider = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Thickness</label><input type="text" v-model.number="model.thickness" @input="$emit('update')">
    <label>Color</label><input type="text" v-model="model.color" @input="$emit('update')">
  </div>`
}
const InspectorSpacer = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Height (px)</label><input type="text" v-model.number="model.height" @input="$emit('update')">
  </div>`
}
const InspectorColumns2 = {
  props: ['model'], emits: ['update'],
  template: `<div>
    <label>Gap (px)</label><input type="text" v-model.number="model.gap" @input="$emit('update')">
    <p style="opacity:.7">Open to extend: nested column editors.</p>
  </div>`
}
function inspectorFor(b) {
  return (
    b?.type === 'heading' ? InspectorHeading :
    b?.type === 'paragraph' ? InspectorParagraph :
    b?.type === 'image' ? InspectorImage :
    b?.type === 'button' ? InspectorButton :
    b?.type === 'divider' ? InspectorDivider :
    b?.type === 'spacer' ? InspectorSpacer :
    b?.type === 'columns2' ? InspectorColumns2 :
    { template: '<div>Unsupported block.</div>' }
  )
}
const Inspectors = {
  heading: InspectorHeading,
  paragraph: InspectorParagraph,
  image: InspectorImage,
  button: InspectorButton,
  divider: InspectorDivider,
  spacer: InspectorSpacer,
  columns2: InspectorColumns2,
}
const FallbackInspector = { template: '<div style="opacity:.7">No inspector for this block.</div>' }

function onInspectorUpdate() { 
  console.log(3)
  // emit('update:modelValue', tree) 
}

function doExport() {
  const html = renderDivTree(tree)
  emit('export', { html, format: props.renderer })
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
</script>
