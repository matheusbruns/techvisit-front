export const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const regex = /^(\d{3})(\d{3})?(\d{3})?(\d{2})?$/;
    const match = regex.exec(cleaned);

    if (match) {
        return `${match[1]}${match[2] ? '.' + match[2] : ''}${match[3] ? '.' + match[3] : ''}${match[4] ? '-' + match[4] : ''}`;
    }
    return value;
};

export const isValidCPF = (cpf: string) => {
    if (!cpf) return false;

    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let firstCheckDigit = (sum * 10) % 11;
    if (firstCheckDigit === 10) firstCheckDigit = 0;
    if (firstCheckDigit !== parseInt(cpf.charAt(9))) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    let secondCheckDigit = (sum * 10) % 11;
    if (secondCheckDigit === 10) secondCheckDigit = 0;
    if (secondCheckDigit !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
};

export const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const regex = /^(\d{2})(\d{5})?(\d{4})?$/;
    const match = regex.exec(cleaned);

    if (match) {
        return `(${match[1]}) ${match[2] ? match[2] : ''}${match[3] ? '-' + match[3] : ''}`;
    }
    return value;
};

export const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const regex = /^(\d{5})(\d{3})?$/;
    const match = regex.exec(cleaned);

    if (match) {
        return `${match[1]}-${match[2] ? match[2] : ''}`;
    }
    return value;
};

export const validatePasswordStrength = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
};