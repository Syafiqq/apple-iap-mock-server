const { ellipse } = require('./string-util')

const diff = (diff, obj1, obj2, key) => {
    if (key in obj1) {
        if (key in obj2 && obj1[key] !== obj2[key]) {
            diff.changed[key] = `${ellipse(String(obj1[key]))} => ${ellipse(String(obj2[key]))}`
        } else if (!(key in obj2)) {
            diff.removed[key] = true
        }
    } else {
        if (key in obj2) {
            diff.added[key] = ellipse(String(obj2[key]))
        }
    }
}

const performDiff = (obj1, obj2, keys) => {
    let differ = { added: {}, removed: {}, changed: {}}
    keys.forEach(x => diff(differ, obj1, obj2, x))

    let objDiff =  {
        before: {
            ...(obj1 || {}),
        },
        after: {
            ...(obj2 || {}),
        },
        diff: {
            ...differ,
        },
    }

    if (Object.keys(objDiff.before).length <= 0) {
        objDiff.before = '-'
    }
    if (Object.keys(objDiff.after).length <= 0) {
        objDiff.after = '-'
    }
    if (Object.keys(objDiff.diff.added).length <= 0) {
        objDiff.diff.added = '-'
    }
    if (Object.keys(objDiff.diff.removed).length <= 0) {
        objDiff.diff.removed = '-'
    }
    if (Object.keys(objDiff.diff.changed).length <= 0) {
        objDiff.diff.changed = '-'
    }
    return objDiff
}

module.exports = {
    performDiff,
}