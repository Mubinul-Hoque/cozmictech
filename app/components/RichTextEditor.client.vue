<template>
  <div class="rich-text-editor-wrapper">
    <div v-show="!quillFailed" ref="editorEl" class="quill-editor-instance bg-white"></div>
    <div v-if="quillFailed" class="space-y-2">
      <div class="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
        <span>Standard text editor mode active (HTML formatting supported).</span>
      </div>
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        rows="12"
        class="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#feb900] focus:ring-1 focus:ring-[#feb900] transition-all text-sm leading-relaxed font-sans"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write content here...'
  }
});

const emit = defineEmits(['update:modelValue']);
const editorEl = ref(null);
const quillFailed = ref(false);
let quillInstance = null;

onMounted(async () => {
  await nextTick();
  if (!editorEl.value) {
    console.warn('Editor DOM element not found after nextTick, falling back to standard textarea');
    quillFailed.value = true;
    return;
  }

  try {
    // Initialize Quill instance safely with standard supported toolbar
    quillInstance = new Quill(editorEl.value, {
      theme: 'snow',
      placeholder: props.placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link'],
          ['clean']
        ]
      }
    });

    // Set initial content if any exists
    if (props.modelValue) {
      quillInstance.root.innerHTML = props.modelValue;
    }

    // Handle local text change notifications
    quillInstance.on('text-change', () => {
      let contentHtml = quillInstance.root.innerHTML;
      // Normalize empty paragraphs (Quill sets '<p><br></p>' by default when editor is empty)
      if (contentHtml === '<p><br></p>') {
        contentHtml = '';
      }
      emit('update:modelValue', contentHtml);
    });
  } catch (err) {
    console.error('Failed to initialize Quill editor, falling back to standard textarea:', err);
    quillFailed.value = true;
  }
});

// Watch for external content updates (e.g., when API data resolves and loads)
watch(
  () => props.modelValue,
  (newVal) => {
    if (!quillInstance) return;
    const currentHTML = quillInstance.root.innerHTML;
    if (newVal !== currentHTML && !(newVal === '' && currentHTML === '<p><br></p>')) {
      quillInstance.root.innerHTML = newVal || '';
    }
  }
);

onBeforeUnmount(() => {
  quillInstance = null;
});
</script>

<style>
/* Modern styling overrides for Quill snow theme */
.rich-text-editor-wrapper .ql-toolbar.ql-snow {
  border: 1px solid #cbd5e1 !important;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  background-color: #f8fafc;
  padding: 8px 12px;
}

.rich-text-editor-wrapper .ql-container.ql-snow {
  border: 1px solid #cbd5e1 !important;
  border-top: none !important;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  font-family: inherit;
  font-size: 0.875rem;
  min-height: 250px;
}

.rich-text-editor-wrapper .ql-editor {
  min-height: 250px;
  line-height: 1.6;
}

.rich-text-editor-wrapper .ql-editor.ql-blank::before {
  font-style: normal;
  color: #94a3b8;
  left: 15px;
}

.rich-text-editor-wrapper .ql-editor p {
  margin-bottom: 0.75rem;
}
</style>
