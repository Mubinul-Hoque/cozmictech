<template>
  <div class="rich-text-editor-wrapper">
    <div ref="editorEl" class="quill-editor-instance bg-white"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
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
let quillInstance = null;

onMounted(() => {
  if (!editorEl.value) return;

  // Add custom SVG icons for Undo & Redo to Quill's UI icons registry
  const icons = Quill.import('ui/icons');
  icons['undo'] = `<svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"/>
    <path class="ql-stroke" d="M6,10 C9,6 14,8 14,12 C14,14 12,16 10,16"/>
  </svg>`;
  icons['redo'] = `<svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"/>
    <path class="ql-stroke" d="M12,10 C9,6 4,8 4,12 C4,14 6,16 8,16"/>
  </svg>`;

  // Initialize Quill instance
  quillInstance = new Quill(editorEl.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link'],
          ['clean'],
          ['undo', 'redo']
        ],
        handlers: {
          undo() {
            if (quillInstance) quillInstance.history.undo();
          },
          redo() {
            if (quillInstance) quillInstance.history.redo();
          }
        }
      }
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
