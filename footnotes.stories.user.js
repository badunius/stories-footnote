// ==UserScript==
// @name     Stories Footnotes
// @match https://ponyfiction.org/story/*/chapter/add/
// @version  1.0
// @grant    none
// @run-at document-end
// ==/UserScript==

// markItUpHeader

const cel = (tag, classes, parent) => {
	const el = document.createElement(tag)
	if (parent) {
		parent.appendChild(el)
	}
	if (classes) {
		el.className = classes
	}
	return el
}

const nextId = (text) => {
	let n = 1
	do {
		if (text.includes(`<footnote id="ft${n}">`)) {
			n += 1
		} else {
			return n
		}
	} while (true)
}

const insertFN = () => {
	const area = document.querySelector('#markItUpId_text textarea')
	if (area) {
		const text = prompt('Текст сноски:')
		const id = nextId(area.value)
		const note = `<sup><a href="#ft${id}">[${id}]</a></sup>`
		const foot = `\n<footnote id="ft${id}">${text}</footnote>`
		const pos = area.selectionEnd
		const src = area.value
		area.value = src.slice(0, pos) + note + src.slice(pos) + foot
	}
}

const makeButton = (root) => {
	const li = cel('li', 'markItUpButton', root)
	li.id = 'footnote'
	const a = cel('a', '', li)
	a.innerHTML = '<small>ab</small><sup>1</sup>'
	a.style.cursor = 'pointer'
	a.style.color = '#555'
	a.title = 'Сноска (в позиции курсора)'
	console.log({ a })
	a.onclick = insertFN
}

const changes = (mutationList, observer) => {
	for (const mutation of mutationList) {
		const target = mutation?.target
		if (target?.id === 'markItUpId_text') {
			const button = target.querySelector(
				'.markItUpHeader .markItUpButton#footnote'
			)
			if (!button) {
				const footnotes = makeButton(
					target.querySelector('.markItUpHeader > ul')
				)
			}
		}
	}
}

const observe = () => {
	const targetNode = document.body

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true }

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(changes)

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config)
}

observe()
