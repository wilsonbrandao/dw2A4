
import { render, fireEvent, waitForElementToBeRemoved, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import List from './List'


describe('List Component', () => {
    it('should render list items', () => {
        const { getByText, rerender, queryByText } = render(<List initialItems={['Diego', 'Rodz', 'Mayk']} />)
        
        expect(getByText('Diego')).toBeInTheDocument()
        expect(getByText('Rodz')).toBeInTheDocument()
        expect(getByText('Mayk')).toBeInTheDocument()
        
         rerender(<List initialItems={['Julia']} />)
        
        expect(screen.getByText('Julia')).toBeInTheDocument()
        expect(screen.queryByText('Mayk')).not.toBeInTheDocument()
    });

    it('should be able to add new item to the list', async () => {
        const { getByText, getByPlaceholderText, findByText } = render(<List initialItems={[]} />)

        const inputElement = getByPlaceholderText('Novo item');
        const addButton = getByText('Adicionar');

        
        userEvent.type(inputElement, 'Novo')
        userEvent.click(addButton);

        await waitFor(() => {
            expect(getByText('Novo')).toBeInTheDocument()
        })
    });

    it('should be able to remove item from the list', async () => {
        const { getByText, getAllByText, queryByText } = render(<List initialItems={['Diego', 'Rodz', 'Mayk']} />)

        const addButton = getByText('Adicionar');
        const removeButton = getAllByText('Remover');

        
        userEvent.click(removeButton[0]);

        await waitForElementToBeRemoved(() => {
            return queryByText('Diego')
        })

    });
});