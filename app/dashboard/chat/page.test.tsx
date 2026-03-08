import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
// @ts-expect-error - Client component testing
import ChatPage from '@/app/dashboard/chat/page'

describe('Chat Page', () => {
  it('renders initial greeting message', () => {
    render(<ChatPage />)
    expect(screen.getByText(/Hello. I'm ClearLeaf/)).toBeInTheDocument()
  })

  it('allows user to type in input field', () => {
    render(<ChatPage />)
    const textarea = screen.getByPlaceholderText(/Ask about Ontario employment law/i)
    
    fireEvent.change(textarea, { target: { value: 'Test question' } })
    expect(textarea).toHaveValue('Test question')
  })

  it('disables send button when input is empty', () => {
    render(<ChatPage />)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    expect(sendButton).toHaveClass('cursor-not-allowed')
  })

  it('enables send button when input has text', () => {
    render(<ChatPage />)
    const textarea = screen.getByPlaceholderText(/Ask about Ontario employment law/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(textarea, { target: { value: 'Can I terminate?' } })
    expect(sendButton).toHaveClass('cursor-pointer')
  })

  it('displays suggestion buttons', () => {
    render(<ChatPage />)
    
    expect(screen.getByText('Termination notice')).toBeInTheDocument()
    expect(screen.getByText('Harassment complaint')).toBeInTheDocument()
    expect(screen.getByText('Parental leave')).toBeInTheDocument()
  })

  it('prefills input when suggestion is clicked', () => {
    render(<ChatPage />)
    const suggestionButton = screen.getByText('Termination notice')
    const textarea = screen.getByPlaceholderText(/Ask about Ontario employment law/i)
    
    fireEvent.click(suggestionButton)
    expect(textarea).toHaveValue('Can I terminate an employee without cause?')
  })

  it('displays confidence badge with high confidence response', async () => {
    render(<ChatPage />)
    const textarea = screen.getByPlaceholderText(/Ask about Ontario employment law/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(textarea, { target: { value: 'Termination notice?' } })
    fireEvent.click(sendButton)
    
    // Wait for response to appear
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    expect(screen.getByText('High Confidence')).toBeInTheDocument()
  })

  it('displays legal source citation', async () => {
    render(<ChatPage />)
    const textarea = screen.getByPlaceholderText(/Ask about Ontario employment law/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(textarea, { target: { value: 'Termination?' } })
    fireEvent.click(sendButton)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    expect(screen.getByText('Legal Source')).toBeInTheDocument()
  })

  it('shows disclaimer message', () => {
    render(<ChatPage />)
    expect(screen.getByText(/This is informational only and does not constitute legal advice/)).toBeInTheDocument()
  })
})
