import { reactive as Z, watch as J, ref as $, createElementBlock as c, openBlock as u, createElementVNode as o, Fragment as I, renderList as B, unref as Q, toDisplayString as k, withModifiers as h, createCommentVNode as A, normalizeClass as X, createBlock as ee, resolveDynamicComponent as te } from "vue";
const w = {
  heading: {
    label: "Heading",
    defaults: { text: "Your Heading", level: 2, align: "left" }
  },
  paragraph: {
    label: "Paragraph",
    defaults: { text: "Write something meaningful here...", align: "left" }
  },
  image: {
    label: "Image",
    defaults: { src: "https://via.placeholder.com/600x200", alt: "Image", width: "100%" }
  },
  button: {
    label: "Button",
    defaults: { text: "Click Me", url: "#", align: "left" }
  },
  divider: {
    label: "Divider",
    defaults: { thickness: 1, color: "#e5e7eb" }
  },
  spacer: {
    label: "Spacer",
    defaults: { height: 16 }
  },
  columns2: {
    label: "Columns (2)",
    defaults: { gap: 16, cols: [{ blocks: [] }, { blocks: [] }] }
  }
};
function L(r) {
  const i = w[r];
  if (!i) throw new Error(`Unknown block: ${r}`);
  return { id: crypto.randomUUID(), type: r, ...structuredClone(i.defaults) };
}
function m(r = {}) {
  return Object.entries(r).filter(([, i]) => i != null && i !== "").map(([i, g]) => `${i.replace(/([A-Z])/g, "-$1").toLowerCase()}:${g}`).join(";");
}
function le(r) {
  const i = [
    "<!doctype html>",
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Email</title></head><body style="margin:0;padding:0;background:#f5f5f5;">',
    '<div style="max-width:640px;margin:0 auto;padding:16px;background:#ffffff;">'
  ], g = (a) => {
    switch (a.type) {
      case "heading": {
        const l = `h${a.level || 2}`;
        return `<${l} style="${m({ textAlign: a.align, margin: "0 0 12px" })}">${b(a.text)}</${l}>`;
      }
      case "paragraph":
        return `<p style="${m({ textAlign: a.align, margin: "0 0 12px", lineHeight: "1.5" })}">${b(a.text)}</p>`;
      case "image":
        return `<img src="${C(a.src)}" alt="${C(a.alt)}" style="${m({ width: a.width || "100%", height: "auto", display: "block", margin: "0 0 12px" })}"/>`;
      case "button": {
        const l = m({
          display: "inline-block",
          background: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          textAlign: "center",
          margin: "0 0 12px"
        });
        return `<div style="${m({ textAlign: a.align })}"><a href="${C(a.url)}" style="${l}">${b(a.text)}</a></div>`;
      }
      case "divider":
        return `<hr style="${m({ border: 0, height: `${a.thickness || 1}px`, background: a.color || "#e5e7eb", margin: "12px 0" })}">`;
      case "spacer":
        return `<div style="${m({ height: `${a.height || 16}px` })}"></div>`;
      case "columns2": {
        const l = a.gap ?? 16, y = (p) => `<div style="${m({ flex: "1 1 0" })}">${p.map(g).join("")}</div>`;
        return `<div style="${m({ display: "flex", gap: `${l}px`, margin: "0 0 12px" })}">${a.cols.map((p) => y(p.blocks || [])).join("")}</div>`;
      }
      default:
        return "";
    }
  };
  for (const a of r) i.push(g(a));
  return i.push("</div></body></html>"), i.join("");
}
function b(r = "") {
  return r.replace(/[&<>]/g, (i) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[i]);
}
function C(r = "") {
  return r.replace(/["&<>]/g, (i) => ({ '"': "&quot;", "&": "&amp;", "<": "&lt;", ">": "&gt;" })[i]);
}
const ne = { class: "eb" }, oe = { class: "toolbar" }, ae = { class: "canvas" }, ie = { class: "panel" }, se = { class: "body" }, re = ["onDragstart"], de = { class: "panel" }, pe = { class: "body" }, ue = {
  key: 0,
  style: { opacity: ".7" }
}, ce = ["onDragstart", "onClick"], me = { style: { display: "block", "margin-bottom": ".25rem" } }, ge = { style: { opacity: ".7" } }, ve = { class: "controls" }, fe = ["onClick", "disabled"], ye = ["onClick", "disabled"], he = ["onClick"], xe = {
  key: 1,
  class: "ghost"
}, $e = { class: "panel" }, ke = {
  key: 0,
  class: "body"
}, be = {
  key: 1,
  class: "body"
}, we = {
  __name: "EmailBuilder",
  props: {
    modelValue: { type: Array, default: () => [] },
    renderer: { type: String, default: "div" }
    // 'div' | 'table' (future)
  },
  emits: ["update:modelValue", "export"],
  setup(r, { emit: i }) {
    const g = r, a = i, l = Z(g.modelValue);
    J(() => g.modelValue, (e) => {
      if (e !== l) {
        for (; l.length; ) l.pop();
        l.push(...e);
      }
    });
    const y = $(null), p = $(null), v = $(-1);
    function f(e) {
      l.push(L(e)), a("update:modelValue", l);
    }
    function U(e) {
      l.splice(e, 1), a("update:modelValue", l);
    }
    function D(e, t) {
      const n = e + t;
      if (n < 0 || n >= l.length) return;
      const [s] = l.splice(e, 1);
      l.splice(n, 0, s), a("update:modelValue", l);
    }
    function V(e) {
      var t;
      return ((t = w[e]) == null ? void 0 : t.label) || e;
    }
    function S(e) {
      return e.type === "heading" ? `${e.text}` : e.type === "paragraph" ? `${e.text.slice(0, 40)}…` : e.type === "image" ? `${e.src}` : e.type === "button" ? `${e.text} → ${e.url}` : e.type === "divider" ? `line ${e.thickness}px` : e.type === "spacer" ? `${e.height}px` : e.type === "columns2" ? "two columns" : "";
    }
    const x = $(null);
    function T(e) {
      x.value = e;
    }
    function E(e, t) {
      p.value = { type: "lib", data: e }, t.dataTransfer.effectAllowed = "copy";
    }
    function j(e, t) {
      p.value = { type: "block", data: e }, y.value = e.id, t.dataTransfer.effectAllowed = "move";
    }
    function H(e) {
      var d, _;
      const t = ((_ = (d = e.target.closest(".dropzone")) == null ? void 0 : d.getBoundingClientRect()) == null ? void 0 : _.top) ?? 0, n = e.clientY - t, s = Math.max(0, Math.min(l.length, Math.floor(n / 60)));
      v.value = s;
    }
    function O() {
      if (!p.value) return;
      const { type: e, data: t } = p.value;
      if (e === "lib")
        l.splice(v.value === -1 ? l.length : v.value, 0, L(t));
      else if (e === "block") {
        const n = l.findIndex((s) => s.id === t.id);
        if (n !== -1) {
          const [s] = l.splice(n, 1), d = v.value === -1 ? l.length : v.value;
          l.splice(d, 0, s);
        }
      }
      y.value = null, p.value = null, v.value = -1, a("update:modelValue", l);
    }
    function R() {
      y.value = null, p.value = null, v.value = -1;
    }
    const M = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>Level</label><input type="text" v-model.number="model.level" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
    }, z = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
    <label>Text</label><textarea rows="6" v-model="model.text" @input="$emit('update')"></textarea>
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
    }, P = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
    <label>URL</label><input type="url" v-model="model.src" @input="$emit('update')">
    <label>Alt</label><input type="text" v-model="model.alt" @input="$emit('update')">
    <label>Width</label><input type="text" v-model="model.width" @input="$emit('update')">
  </div>`
    }, Y = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>URL</label><input type="url" v-model="model.url" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
    }, F = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
  <label>Thickness</label><input type="text" v-model.number="model.thickness" @input="$emit('update')">
  <label>Color</label><input type="text" v-model="model.color" @input="$emit('update')">
</div>`
    }, N = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
  <label>Height (px)</label><input type="text" v-model.number="model.height" @input="$emit('update')">
</div>`
    }, W = {
      props: ["model"],
      emits: ["update"],
      template: `<div>
  <label>Gap (px)</label><input type="text" v-model.number="model.gap" @input="$emit('update')">
  <p style="opacity:.7">Open to extend: nested column editors.</p>
</div>`
    };
    function q(e) {
      return (e == null ? void 0 : e.type) === "heading" ? M : (e == null ? void 0 : e.type) === "paragraph" ? z : (e == null ? void 0 : e.type) === "image" ? P : (e == null ? void 0 : e.type) === "button" ? Y : (e == null ? void 0 : e.type) === "divider" ? F : (e == null ? void 0 : e.type) === "spacer" ? N : (e == null ? void 0 : e.type) === "columns2" ? W : { template: "<div>Unsupported block.</div>" };
    }
    function G() {
      a("update:modelValue", l);
    }
    function K() {
      const e = le(l);
      a("export", { html: e, format: g.renderer });
      const t = new Blob([e], { type: "text/html" }), n = URL.createObjectURL(t);
      window.open(n, "_blank"), setTimeout(() => URL.revokeObjectURL(n), 1e4);
    }
    return (e, t) => (u(), c("div", ne, [
      o("div", oe, [
        o("button", {
          class: "btn",
          onClick: t[0] || (t[0] = (n) => f("heading"))
        }, "Heading"),
        o("button", {
          class: "btn",
          onClick: t[1] || (t[1] = (n) => f("paragraph"))
        }, "Paragraph"),
        o("button", {
          class: "btn",
          onClick: t[2] || (t[2] = (n) => f("image"))
        }, "Image"),
        o("button", {
          class: "btn",
          onClick: t[3] || (t[3] = (n) => f("button"))
        }, "Button"),
        o("button", {
          class: "btn",
          onClick: t[4] || (t[4] = (n) => f("divider"))
        }, "Divider"),
        o("button", {
          class: "btn",
          onClick: t[5] || (t[5] = (n) => f("spacer"))
        }, "Spacer"),
        o("button", {
          class: "btn",
          onClick: t[6] || (t[6] = (n) => f("columns2"))
        }, "2 Columns"),
        t[8] || (t[8] = o("div", { style: { flex: "1" } }, null, -1)),
        o("button", {
          class: "btn",
          onClick: t[7] || (t[7] = (n) => a("update:modelValue", []))
        }, "Clear"),
        o("button", {
          class: "btn primary",
          onClick: K
        }, "Export HTML")
      ]),
      o("div", ae, [
        o("section", ie, [
          t[9] || (t[9] = o("h3", null, "Blocks", -1)),
          o("div", se, [
            (u(!0), c(I, null, B(Q(w), (n, s) => (u(), c("div", {
              key: s,
              class: "block",
              draggable: "",
              onDragstart: (d) => E(s, d)
            }, k(n.label), 41, re))), 128))
          ])
        ]),
        o("section", de, [
          t[10] || (t[10] = o("h3", null, "Canvas", -1)),
          o("div", pe, [
            o("div", {
              class: "dropzone",
              onDragover: h(H, ["prevent"]),
              onDrop: h(O, ["prevent"])
            }, [
              l.length === 0 ? (u(), c("p", ue, "Drag blocks here… or use the toolbar.")) : A("", !0),
              (u(!0), c(I, null, B(l, (n, s) => (u(), c("div", {
                key: n.id,
                class: X(["block", { dragging: y.value === n.id }]),
                draggable: "",
                onDragstart: (d) => j(n, d),
                onDragend: R,
                onClick: (d) => T(n)
              }, [
                o("strong", me, k(V(n.type)), 1),
                o("small", ge, k(S(n)), 1),
                o("div", ve, [
                  o("button", {
                    class: "btn",
                    onClick: h((d) => D(s, -1), ["stop"]),
                    disabled: s === 0
                  }, "↑", 8, fe),
                  o("button", {
                    class: "btn",
                    onClick: h((d) => D(s, 1), ["stop"]),
                    disabled: s === l.length - 1
                  }, "↓", 8, ye),
                  o("button", {
                    class: "btn",
                    onClick: h((d) => U(s), ["stop"])
                  }, "✕", 8, he)
                ])
              ], 42, ce))), 128)),
              v.value !== -1 ? (u(), c("div", xe)) : A("", !0)
            ], 32)
          ])
        ]),
        o("section", $e, [
          t[12] || (t[12] = o("h3", null, "Inspector", -1)),
          x.value ? (u(), c("div", ke, [
            (u(), ee(te(q(x.value)), {
              model: x.value,
              onUpdate: G
            }, null, 40, ["model"]))
          ])) : (u(), c("div", be, [...t[11] || (t[11] = [
            o("p", { style: { opacity: ".7" } }, "Select a block to edit its properties.", -1)
          ])]))
        ])
      ])
    ]));
  }
};
export {
  we as EmailBuilder
};
