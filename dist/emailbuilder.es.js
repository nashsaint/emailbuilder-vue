import { reactive as J, watch as W, ref as k, createElementBlock as c, openBlock as p, createElementVNode as l, Fragment as $, renderList as S, unref as Y, toDisplayString as D, withModifiers as f, createCommentVNode as C, normalizeClass as G, createBlock as K, resolveDynamicComponent as Z } from "vue";
function Q() {
  return typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
    const i = Math.random() * 16 | 0;
    return (s === "x" ? i : i & 3 | 8).toString(16);
  });
}
function X(s) {
  return typeof structuredClone == "function" ? structuredClone(s) : JSON.parse(JSON.stringify(s));
}
const T = {
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
function _(s) {
  const i = T[s];
  if (!i) throw new Error(`Unknown block: ${s}`);
  return {
    id: Q(),
    type: s,
    ...X(i.defaults)
  };
}
function x(s = {}) {
  return Object.entries(s).filter(([, i]) => i != null && i !== "").map(([i, v]) => `${i.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(";");
}
function ee(s) {
  const i = [
    "<!doctype html>",
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Email</title></head><body style="margin:0;padding:0;background:#f5f5f5;">',
    '<div style="max-width:640px;margin:0 auto;padding:16px;background:#ffffff;">'
  ], v = (a) => {
    switch (a.type) {
      case "heading": {
        const n = `h${a.level || 2}`;
        return `<${n} style="${x({ textAlign: a.align, margin: "0 0 12px" })}">${I(a.text)}</${n}>`;
      }
      case "paragraph":
        return `<p style="${x({ textAlign: a.align, margin: "0 0 12px", lineHeight: "1.5" })}">${I(a.text)}</p>`;
      case "image":
        return `<img src="${w(a.src)}" alt="${w(a.alt)}" style="${x({ width: a.width || "100%", height: "auto", display: "block", margin: "0 0 12px" })}"/>`;
      case "button": {
        const n = x({
          display: "inline-block",
          background: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          textAlign: "center",
          margin: "0 0 12px"
        });
        return `<div style="${x({ textAlign: a.align })}"><a href="${w(a.url)}" style="${n}">${I(a.text)}</a></div>`;
      }
      case "divider":
        return `<hr style="${x({ border: 0, height: `${a.thickness || 1}px`, background: a.color || "#e5e7eb", margin: "12px 0" })}">`;
      case "spacer":
        return `<div style="${x({ height: `${a.height || 16}px` })}"></div>`;
      case "columns2": {
        const n = a.gap ?? 16, y = (u) => `<div style="${x({ flex: "1 1 0" })}">${u.map(v).join("")}</div>`;
        return `<div style="${x({ display: "flex", gap: `${n}px`, margin: "0 0 12px" })}">${a.cols.map((u) => y(u.blocks || [])).join("")}</div>`;
      }
      default:
        return "";
    }
  };
  for (const a of s) i.push(v(a));
  return i.push("</div></body></html>"), i.join("");
}
function I(s = "") {
  return s.replace(/[&<>]/g, (i) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[i]);
}
function w(s = "") {
  return s.replace(/["&<>]/g, (i) => ({ '"': "&quot;", "&": "&amp;", "<": "&lt;", ">": "&gt;" })[i]);
}
const te = { class: "eb" }, ne = { class: "toolbar" }, le = { class: "canvas" }, oe = { class: "panel" }, ae = { class: "body" }, ie = ["onDragstart"], re = { class: "panel" }, se = { class: "body" }, de = {
  key: 0,
  class: "ghost"
}, pe = {
  key: 0,
  class: "ghost"
}, ue = ["onDragstart", "onDragover", "onMousedown", "onClick"], ce = { style: { display: "block", "margin-bottom": ".25rem" } }, me = { style: { opacity: ".7" } }, ge = ["onClick", "disabled"], ve = ["onClick", "disabled"], fe = ["onClick"], xe = {
  key: 1,
  class: "ghost"
}, be = { class: "panel" }, ye = {
  key: 0,
  class: "body"
}, he = {
  key: 1,
  class: "body"
}, Ae = {
  __name: "EmailBuilder",
  props: {
    modelValue: { type: Array, default: () => [] },
    renderer: { type: String, default: "div" }
    // 'div' | 'table' (future)
  },
  emits: ["update:modelValue", "export"],
  setup(s, { emit: i }) {
    const v = s, a = i, n = J(v.modelValue);
    W(
      () => v.modelValue,
      (t) => {
        if (t !== n) {
          for (; n.length; ) n.pop();
          n.push(...t);
        }
      }
    );
    const y = k(null), u = k(null), m = k(-1);
    function L(t, e) {
      var d;
      const r = e.currentTarget.getBoundingClientRect(), o = r.top + r.height / 2;
      m.value = e.clientY < o ? t : t + 1, e.dataTransfer && (e.dataTransfer.dropEffect = ((d = u.value) == null ? void 0 : d.type) === "block" ? "move" : "copy");
    }
    function U(t) {
      var o;
      t.dataTransfer && (t.dataTransfer.dropEffect = ((o = u.value) == null ? void 0 : o.type) === "block" ? "move" : "copy");
      const e = t.currentTarget, r = Array.from(e.querySelectorAll(":scope > .block"));
      m.value = r.length ? n.length : 0;
    }
    function E(t) {
      const e = t.relatedTarget;
      t.currentTarget.contains(e) || (m.value = -1);
    }
    function V(t, e) {
      u.value = { type: "lib", data: t }, e.dataTransfer.effectAllowed = "copy", e.dataTransfer.setData("text/plain", `lib:${t}`);
    }
    function O(t, e) {
      u.value = { type: "block", data: t }, y.value = t.id, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", `block:${t.id}`);
    }
    function H() {
      const t = m.value < 0 ? n.length : m.value, e = u.value;
      if (e) {
        if (e.type === "lib")
          n.splice(t, 0, _(e.data));
        else if (e.type === "block") {
          const r = n.findIndex((o) => o.id === e.data.id);
          if (r !== -1) {
            const [o] = n.splice(r, 1), d = r < t ? t - 1 : t;
            n.splice(d, 0, o);
          }
        }
        a("update:modelValue", n), m.value = -1, y.value = null, u.value = null;
      }
    }
    function R() {
      y.value = null, u.value = null, m.value = -1;
    }
    function b(t) {
      n.push(_(t)), a("update:modelValue", n);
    }
    function j(t) {
      n.splice(t, 1), a("update:modelValue", n);
    }
    function B(t, e) {
      const r = t + e;
      if (r < 0 || r >= n.length) return;
      const [o] = n.splice(t, 1);
      n.splice(r, 0, o), a("update:modelValue", n);
    }
    function M(t) {
      var e;
      return ((e = T[t]) == null ? void 0 : e.label) || t;
    }
    function z(t) {
      return t.type === "heading" ? t.text : t.type === "paragraph" ? `${t.text.slice(0, 40)}…` : t.type === "image" ? t.src : t.type === "button" ? `${t.text} → ${t.url}` : t.type === "divider" ? `line ${t.thickness}px` : t.type === "spacer" ? `${t.height}px` : t.type === "columns2" ? "two columns" : "";
    }
    const h = k(null);
    function A(t) {
      h.value = t;
    }
    const N = {
      heading: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>Level</label><input type="text" v-model.number="model.level" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
      },
      paragraph: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Text</label><textarea rows="6" v-model="model.text" @input="$emit('update')"></textarea>
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
      },
      image: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>URL</label><input type="url" v-model="model.src" @input="$emit('update')">
    <label>Alt</label><input type="text" v-model="model.alt" @input="$emit('update')">
    <label>Width</label><input type="text" v-model="model.width" @input="$emit('update')">
  </div>`
      },
      button: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Text</label><input type="text" v-model="model.text" @input="$emit('update')">
    <label>URL</label><input type="url" v-model="model.url" @input="$emit('update')">
    <label>Align</label><input type="text" v-model="model.align" @input="$emit('update')">
  </div>`
      },
      divider: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Thickness</label><input type="text" v-model.number="model.thickness" @input="$emit('update')">
    <label>Color</label><input type="text" v-model="model.color" @input="$emit('update')">
  </div>`
      },
      spacer: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Height (px)</label><input type="text" v-model.number="model.height" @input="$emit('update')">
  </div>`
      },
      columns2: {
        props: ["model"],
        emits: ["update"],
        template: `<div>
    <label>Gap (px)</label><input type="text" v-model.number="model.gap" @input="$emit('update')">
    <p style="opacity:.7">Open to extend: nested column editors.</p>
  </div>`
      }
    }, P = { template: '<div style="opacity:.7">No inspector for this block.</div>' };
    function q() {
      console.log(3);
    }
    function F() {
      const t = ee(n);
      a("export", { html: t, format: v.renderer });
      const e = new Blob([t], { type: "text/html" }), r = URL.createObjectURL(e);
      window.open(r, "_blank"), setTimeout(() => URL.revokeObjectURL(r), 1e4);
    }
    return (t, e) => {
      var r;
      return p(), c("div", te, [
        l("div", ne, [
          l("button", {
            class: "btn",
            onClick: e[0] || (e[0] = (o) => b("heading"))
          }, "Heading"),
          l("button", {
            class: "btn",
            onClick: e[1] || (e[1] = (o) => b("paragraph"))
          }, "Paragraph"),
          l("button", {
            class: "btn",
            onClick: e[2] || (e[2] = (o) => b("image"))
          }, "Image"),
          l("button", {
            class: "btn",
            onClick: e[3] || (e[3] = (o) => b("button"))
          }, "Button"),
          l("button", {
            class: "btn",
            onClick: e[4] || (e[4] = (o) => b("divider"))
          }, "Divider"),
          l("button", {
            class: "btn",
            onClick: e[5] || (e[5] = (o) => b("spacer"))
          }, "Spacer"),
          l("button", {
            class: "btn",
            onClick: e[6] || (e[6] = (o) => b("columns2"))
          }, "2 Columns"),
          e[10] || (e[10] = l("div", { style: { flex: "1" } }, null, -1)),
          l("button", {
            class: "btn",
            onClick: e[7] || (e[7] = (o) => a("update:modelValue", []))
          }, "Clear"),
          l("button", {
            class: "btn primary",
            onClick: F
          }, "Export HTML")
        ]),
        l("div", le, [
          l("section", oe, [
            e[11] || (e[11] = l("h3", null, "Blocks", -1)),
            l("div", ae, [
              (p(!0), c($, null, S(Y(T), (o, d) => (p(), c("div", {
                key: d,
                class: "block",
                draggable: "true",
                onDragstart: (g) => V(d, g)
              }, D(o.label), 41, ie))), 128))
            ])
          ]),
          l("section", re, [
            e[13] || (e[13] = l("h3", null, "Canvas", -1)),
            l("div", se, [
              l("div", {
                class: "dropzone",
                onDragover: f(U, ["stop", "prevent"]),
                onDrop: f(H, ["stop", "prevent"]),
                onDragenter: e[9] || (e[9] = f(() => {
                }, ["stop", "prevent"])),
                onDragleave: E
              }, [
                n.length === 0 ? (p(), c($, { key: 0 }, [
                  e[12] || (e[12] = l("p", { style: { opacity: ".7" } }, "Drag blocks here… or use the toolbar.", -1)),
                  m.value === 0 ? (p(), c("div", de)) : C("", !0)
                ], 64)) : C("", !0),
                (p(!0), c($, null, S(n, (o, d) => (p(), c($, {
                  key: o.id
                }, [
                  m.value === d ? (p(), c("div", pe)) : C("", !0),
                  l("div", {
                    class: G(["block", { dragging: y.value === o.id }]),
                    draggable: "true",
                    onDragstart: (g) => O(o, g),
                    onDragend: R,
                    onDragover: f((g) => L(d, g), ["stop", "prevent"]),
                    onMousedown: f((g) => A(o), ["stop"]),
                    onClick: (g) => A(o)
                  }, [
                    l("strong", ce, D(M(o.type)), 1),
                    l("small", me, D(z(o)), 1),
                    l("div", {
                      class: "controls",
                      onMousedown: e[8] || (e[8] = f(() => {
                      }, ["stop"]))
                    }, [
                      l("button", {
                        class: "btn",
                        onClick: f((g) => B(d, -1), ["stop"]),
                        disabled: d === 0
                      }, "↑", 8, ge),
                      l("button", {
                        class: "btn",
                        onClick: f((g) => B(d, 1), ["stop"]),
                        disabled: d === n.length - 1
                      }, "↓", 8, ve),
                      l("button", {
                        class: "btn",
                        onClick: f((g) => j(d), ["stop"])
                      }, "✕", 8, fe)
                    ], 32)
                  ], 42, ue)
                ], 64))), 128)),
                n.length && m.value === n.length ? (p(), c("div", xe)) : C("", !0)
              ], 32)
            ])
          ]),
          l("section", be, [
            e[15] || (e[15] = l("h3", null, "Inspector", -1)),
            h.value ? (p(), c("div", ye, [
              (p(), K(Z(N[(r = h.value) == null ? void 0 : r.type] || P), {
                model: h.value,
                onUpdate: q
              }, null, 40, ["model"]))
            ])) : (p(), c("div", he, [...e[14] || (e[14] = [
              l("p", { style: { opacity: ".7" } }, "Select a block to edit its properties.", -1)
            ])]))
          ])
        ])
      ]);
    };
  }
};
export {
  Ae as EmailBuilder
};
