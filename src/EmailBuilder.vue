<template>
  <div class="eb">
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
          <div v-for="(def, key) in BLOCKS" :key="key" class="block" draggable @dragstart="onLibDragStart(key, $event)">
            {{ def.label }}
          </div>
        </div>
      </section>

      <!-- Canvas -->
      <section class="panel">
        <h3>Canvas</h3>
        <div class="body">
          <div class="dropzone" @dragover.prevent="onDragOver" @drop.prevent="onDropOnCanvas">
            <template v-if="tree.length === 0">
              <p style="opacity:.7">Drag blocks here… or use the toolbar.</p>
            </template>
            <div v-for="(b, i) in tree" :key="b.id" class="block" :class="{ dragging: draggingId === b.id }" draggable
              @dragstart="onBlockDragStart(b, $event)" @dragend="onDragEnd" @click="select(b)">
              <strong style="display:block;margin-bottom:.25rem">{{ labelOf(b.type) }}</strong>
              <small style="opacity:.7">{{ summarize(b) }}</small>
              <div class="controls">
                <button class="btn" @click.stop="move(i, -1)" :disabled="i === 0">↑</button>
                <button class="btn" @click.stop="move(i, 1)" :disabled="i === tree.length - 1">↓</button>
                <button class="btn" @click.stop="removeAt(i)">✕</button>
              </div>
            </div>
            <div v-if="ghostIndex !== -1" class="ghost"></div>
          </div>
        </div>
      </section>

      <!-- Inspector -->
      <section class="panel">
        <h3>Inspector</h3>
        <div class="body" v-if="selected">
          <component :is="inspectorFor(selected)" :model="selected" @update="onInspectorUpdate" />
        </div>
        <div class="body" v-else>
          <p style="opacity:.7">Select a block to edit its properties.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import './styles.css'
import { reactive, computed, watch, ref } from 'vue'
import { BLOCKS, newBlock } from './blocks.js'
import { renderDivTree } from './renderers/htmlDivRenderer.js'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  renderer: { type: String, default: 'div' } // 'div' | 'table' (future)
})
const emit = defineEmits(['update:modelValue', 'export'])

const tree = reactive(props.modelValue)
watch(() => props.modelValue, v => { if (v !== tree) { while (tree.length) tree.pop(); tree.push(...v) } })

// drag state
const draggingId = ref(null)
const dragPayload = ref(null) // { type: 'lib'|'block', data }
const ghostIndex = ref(-1)

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
  if (b.type === 'heading') return `${b.text}`
  if (b.type === 'paragraph') return `${b.text.slice(0, 40)}…`
  if (b.type === 'image') return `${b.src}`
  if (b.type === 'button') return `${b.text} → ${b.url}`
  if (b.type === 'divider') return `line ${b.thickness}px`
  if (b.type === 'spacer') return `${b.height}px`
  if (b.type === 'columns2') return `two columns`
  return ''
}

// selection
const selected = ref(null)
function select(b) { selected.value = b }

// HTML5 drag & drop (no deps)
function onLibDragStart(type, ev) {
  dragPayload.value = { type: 'lib', data: type }
  ev.dataTransfer.effectAllowed = 'copy'
}
function onBlockDragStart(block, ev) {
  dragPayload.value = { type: 'block', data: block }
  draggingId.value = block.id
  ev.dataTransfer.effectAllowed = 'move'
}
function onDragOver(ev) {
  const y = ev.target.closest('.dropzone')?.getBoundingClientRect()?.top ?? 0
  const offsetY = ev.clientY - y
  // estimate ghost index by dividing by avg block height
  const approxIndex = Math.max(0, Math.min(tree.length, Math.floor(offsetY / 60)))
  ghostIndex.value = approxIndex
}
function onDropOnCanvas() {
  if (!dragPayload.value) return
  const { type, data } = dragPayload.value
  if (type === 'lib') {
    tree.splice(ghostIndex.value === -1 ? tree.length : ghostIndex.value, 0, newBlock(data))
  } else if (type === 'block') {
    const from = tree.findIndex(b => b.id === data.id)
    if (from !== -1) {
      const [item] = tree.splice(from, 1)
      const to = ghostIndex.value === -1 ? tree.length : ghostIndex.value
      tree.splice(to, 0, item)
    }
  }
  draggingId.value = null
  dragPayload.value = null
  ghostIndex.value = -1
  emit('update:modelValue', tree)
}
function onDragEnd() { draggingId.value = null; dragPayload.value = null; ghostIndex.value = -1 }

// Inspector registry (inline components for simplicity)
const InspectorHeading = {
  props: ['model'],
  emits: ['update'],
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
  props: ['model'], emits: ['update'], template: `<div>
  <label>Thickness</label><input type="text" v-model.number="model.thickness" @input="$emit('update')">
  <label>Color</label><input type="text" v-model="model.color" @input="$emit('update')">
</div>` }
const InspectorSpacer = {
  props: ['model'], emits: ['update'], template: `<div>
  <label>Height (px)</label><input type="text" v-model.number="model.height" @input="$emit('update')">
</div>` }
const InspectorColumns2 = {
  props: ['model'], emits: ['update'], template: `<div>
  <label>Gap (px)</label><input type="text" v-model.number="model.gap" @input="$emit('update')">
  <p style="opacity:.7">Open to extend: nested column editors.</p>
</div>` }

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

function onInspectorUpdate() { emit('update:modelValue', tree) }

function doExport() {
  const html = renderDivTree(tree)
  emit('export', { html, format: props.renderer })
  // as a convenience, open a new window
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
</script>