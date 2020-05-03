const createMapper = (original_transaction_id, student_id, subject_id, subscription_plan_id) => {
    return {
        student_id,
        subject_id,
        subscription_plan_id,
        original_transaction_id,
    }
}

module.exports = {
    createMapper,
}