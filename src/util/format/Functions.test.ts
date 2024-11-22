import {
    formatCPF,
    isValidCPF,
    formatPhoneNumber,
    formatCEP,
    validatePasswordStrength,
} from './IFunctions';

describe('Funções Utilitárias', () => {
    describe('formatCPF', () => {
        test('deve formatar o CPF corretamente', () => {
            expect(formatCPF('12345678900')).toBe('123.456.789-00');
            expect(formatCPF('123456789')).toBe('123.456.789');
            expect(formatCPF('123')).toBe('123');
            expect(formatCPF('')).toBe('');
        });

        test('deve lidar com caracteres não numéricos', () => {
            expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
            expect(formatCPF('123a456b789c00')).toBe('123.456.789-00');
        });
    });

    describe('isValidCPF', () => {
        test('deve retornar true para CPFs válidos', () => {
            expect(isValidCPF('123.456.789-09')).toBe(true);
            expect(isValidCPF('935.411.347-80')).toBe(true);
            expect(isValidCPF('93541134780')).toBe(true);
        });

        test('deve retornar false para CPFs inválidos', () => {
            expect(isValidCPF('123.456.789-00')).toBe(false);
            expect(isValidCPF('111.111.111-11')).toBe(false);
            expect(isValidCPF('')).toBe(false);
            expect(isValidCPF('abc')).toBe(false);
            expect(isValidCPF('123')).toBe(false);
        });
    });

    describe('formatPhoneNumber', () => {
        test('deve formatar o número de telefone corretamente', () => {
            expect(formatPhoneNumber('11912345678')).toBe('(11) 91234-5678');
            expect(formatPhoneNumber('1191234')).toBe('(11) 91234');
            expect(formatPhoneNumber('11')).toBe('(11) ');
            expect(formatPhoneNumber('')).toBe('');
        });

        test('deve lidar com caracteres não numéricos', () => {
            expect(formatPhoneNumber('(11)91234-5678')).toBe('(11) 91234-5678');
            expect(formatPhoneNumber('11a91234b5678')).toBe('(11) 91234-5678');
        });
    });

    describe('formatCEP', () => {
        test('deve formatar o CEP corretamente', () => {
            expect(formatCEP('12345678')).toBe('12345-678');
            expect(formatCEP('12345')).toBe('12345-');
            expect(formatCEP('123')).toBe('123');
            expect(formatCEP('')).toBe('');
        });

        test('deve lidar com caracteres não numéricos', () => {
            expect(formatCEP('12345-678')).toBe('12345-678');
            expect(formatCEP('123a456b78')).toBe('12345-678');
        });
    });

    describe('validatePasswordStrength', () => {
        test('deve retornar true para senhas fortes', () => {
            expect(validatePasswordStrength('Aa1!aaaa')).toBe(true);
            expect(validatePasswordStrength('StrongP@ssw0rd')).toBe(true);
        });

        test('deve retornar false para senhas fracas', () => {
            expect(validatePasswordStrength('password')).toBe(false);
            expect(validatePasswordStrength('Password1')).toBe(false);
            expect(validatePasswordStrength('password!')).toBe(false);
            expect(validatePasswordStrength('PASSWORD1!')).toBe(false);
            expect(validatePasswordStrength('Pass1!')).toBe(false);
        });
    });
});
